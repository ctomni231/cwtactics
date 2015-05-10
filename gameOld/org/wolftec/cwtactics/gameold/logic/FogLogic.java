package org.wolftec.cwtactics.gameold.logic;

import org.wolftec.cwtactics.gameold.EngineGlobals;
import org.wolftec.cwtactics.gameold.domain.managers.GameConfigManager;
import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Player;
import org.wolftec.cwtactics.gameold.domain.model.Property;
import org.wolftec.cwtactics.gameold.domain.model.Tile;
import org.wolftec.cwtactics.gameold.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@Constructed
public class FogLogic {

  @Injected
  private GameManager gameround;

  @Injected
  private GameConfigManager config;

  public void modifyVision(int x, int y, Player owner, int range, int value) {

    // ignore neutral objects
    if (owner.team == EngineGlobals.INACTIVE_ID) return;

    if (config.getConfig("fogEnabled").getValue() != 1) return;

    boolean clientVisible = owner.clientVisible;
    boolean turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) return;

    if (range == 0) {
      if (clientVisible) gameround.getTile(x, y).visionClient += value;
      if (turnOwnerVisible) gameround.getTile(x, y).visionTurnOwner += value;

    } else {
      int mW = gameround.mapWidth;
      int mH = gameround.mapHeight;
      int lX;
      int hX;
      int lY = y - range;
      int hY = y + range;

      if (lY < 0) lY = 0;
      if (hY >= mH) hY = mH - 1;
      for (; lY <= hY; lY++) {

        int disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= mW) hX = mW - 1;
        for (; lX <= hX; lX++) {

          // does the tile block vision ?
          if (gameround.getTile(lX, lY).type.blocksVision
              && gameround.getDistance(x, y, lX, lY) > 1) continue;

          if (clientVisible) gameround.getTile(lX, lY).visionClient += value;
          if (turnOwnerVisible) gameround.getTile(lX, lY).visionTurnOwner += value;
        }
      }
    }
  }

  public void fullRecalculation() {
    int x;
    int y;
    int xe = gameround.mapWidth;
    int ye = gameround.mapHeight;
    boolean fogEnabled = (config.getConfig("fogEnabled").getValue() == 1);

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        if (!fogEnabled) { // TODO
          gameround.getTile(x, y).visionTurnOwner = 1;
          gameround.getTile(x, y).visionClient = 1;
        } else {
          gameround.getTile(x, y).visionTurnOwner = 0;
          gameround.getTile(x, y).visionClient = 0;
        }
      }
    }

    // 2. add vision-object
    if (fogEnabled) {
      int vision;
      Unit unit;
      Tile tile;
      Property property;

      for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {
          tile = gameround.getTile(x, y);

          unit = tile.unit;
          if (unit != null) {
            vision = unit.type.vision;
            if (vision < 0) vision = 0;

            modifyVision(x, y, unit.owner, vision, 1);
          }

          property = tile.property;
          if (property != null && property.owner != null) {
            vision = property.type.vision;
            if (vision < 0) vision = 0;

            modifyVision(x, y, property.owner, vision, 1);
          }
        }
      }
    }
  }

  public void removeVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, -1);
  }

  public void removeUnitVision(int x, int y, Player owner) {
    Unit unit = gameround.getTile(x, y).unit;
    if (owner == null) owner = unit.owner;

    removeVision(x, y, owner, unit.type.vision);
  }

  public void removePropertyVision(int x, int y, Player owner) {
    Property prop = gameround.getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    removeVision(x, y, owner, prop.type.vision);
  }

  public void addVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, +1);
  }

  public void addUnitVision(int x, int y, Player owner) {
    Unit unit = gameround.getTile(x, y).unit;
    if (owner == null) owner = unit.owner;

    addVision(x, y, owner, unit.type.vision);
  }

  public void addPropertyVision(int x, int y, Player owner) {
    Property prop = gameround.getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    addVision(x, y, owner, prop.type.vision);
  }
}
