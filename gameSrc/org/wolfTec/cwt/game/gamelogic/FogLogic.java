package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.GameConfigBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Player;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean public class FogLogic {

  @Injected
  private GameRoundBean gameround;
  
  @Injected
  private GameConfigBean config;

  public void modifyVision(int x, int y, Player owner, int range, int value) {

    // ignore neutral objects
    if (owner.team == EngineGlobals.INACTIVE_ID) return;

    if (config.getConfig("fogEnabled").getValue() != 1) return;

    boolean clientVisible = owner.clientVisible;
    boolean turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) return;

    if (range == 0) {
      if (clientVisible) gameround.getMap().getTile(x, y).visionClient += value;
      if (turnOwnerVisible) gameround.getMap().getTile(x, y).visionTurnOwner += value;

    } else {
      int mW = gameround.getMapWidth();
      int mH = gameround.getMapHeight();
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
          if (gameround.getMap().getTile(lX, lY).type.blocksVision
              && gameround.getMap().getDistance(x, y, lX, lY) > 1) continue;

          if (clientVisible) gameround.getMap().getTile(lX, lY).visionClient += value;
          if (turnOwnerVisible) gameround.getMap().getTile(lX, lY).visionTurnOwner += value;
        }
      }
    }
  }

  public void fullRecalculation() {
    int x;
    int y;
    int xe = gameround.getMapWidth();
    int ye = gameround.getMapHeight();
    boolean fogEnabled = (config.getConfig("fogEnabled").getValue() == 1);

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        if (!fogEnabled) { // TODO
          gameround.getMap().getTile(x, y).visionTurnOwner = 1;
          gameround.getMap().getTile(x, y).visionClient = 1;
        } else {
          gameround.getMap().getTile(x, y).visionTurnOwner = 0;
          gameround.getMap().getTile(x, y).visionClient = 0;
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
          tile = gameround.getMap().getTile(x, y);

          unit = tile.unit;
          if (unit != null) {
            vision = unit.getType().vision;
            if (vision < 0) vision = 0;

            modifyVision(x, y, unit.getOwner(), vision, 1);
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
    Unit unit = gameround.getMap().getTile(x, y).unit;
    if (owner == null) owner = unit.getOwner();

    removeVision(x, y, owner, unit.getType().vision);
  }

  public void removePropertyVision(int x, int y, Player owner) {
    Property prop = gameround.getMap().getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    removeVision(x, y, owner, prop.type.vision);
  }

  public void addVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, +1);
  }

  public void addUnitVision(int x, int y, Player owner) {
    Unit unit = gameround.getMap().getTile(x, y).unit;
    if (owner == null) owner = unit.getOwner();

    addVision(x, y, owner, unit.getType().vision);
  }

  public void addPropertyVision(int x, int y, Player owner) {
    Property prop = gameround.getMap().getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    addVision(x, y, owner, prop.type.vision);
  }
}
