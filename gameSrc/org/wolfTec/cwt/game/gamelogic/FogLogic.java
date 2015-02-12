package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.Player;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;

public interface FogLogic extends BaseLogic {

  default void modifyVision(int x, int y, Player owner, int range, int value) {

    // ignore neutral objects
    if (owner.team == EngineGlobals.INACTIVE_ID) return;

    if (getGameConfig().getConfig("fogEnabled").getValue() != 1) return;

    boolean clientVisible = owner.clientVisible;
    boolean turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) return;

    if (range == 0) {
      if (clientVisible) getGameRound().getMap().getTile(x, y).visionClient += value;
      if (turnOwnerVisible) getGameRound().getMap().getTile(x, y).visionTurnOwner += value;

    } else {
      int mW = getGameRound().getMapWidth();
      int mH = getGameRound().getMapHeight();
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
          if (getGameRound().getMap().getTile(lX, lY).type.blocksVision
              && getGameRound().getMap().getDistance(x, y, lX, lY) > 1) continue;

          if (clientVisible) getGameRound().getMap().getTile(lX, lY).visionClient += value;
          if (turnOwnerVisible) getGameRound().getMap().getTile(lX, lY).visionTurnOwner += value;
        }
      }
    }
  }

  default void fullRecalculation() {
    int x;
    int y;
    int xe = getGameRound().getMapWidth();
    int ye = getGameRound().getMapHeight();
    boolean fogEnabled = (getGameConfig().getConfig("fogEnabled").getValue() == 1);

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        if (!fogEnabled) { // TODO
          getGameRound().getMap().getTile(x, y).visionTurnOwner = 1;
          getGameRound().getMap().getTile(x, y).visionClient = 1;
        } else {
          getGameRound().getMap().getTile(x, y).visionTurnOwner = 0;
          getGameRound().getMap().getTile(x, y).visionClient = 0;
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
          tile = getGameRound().getMap().getTile(x, y);

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

  default void removeVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, -1);
  }

  default void removeUnitVision(int x, int y, Player owner) {
    Unit unit = getGameRound().getMap().getTile(x, y).unit;
    if (owner == null) owner = unit.getOwner();

    removeVision(x, y, owner, unit.getType().vision);
  }

  default void removePropertyVision(int x, int y, Player owner) {
    Property prop = getGameRound().getMap().getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    removeVision(x, y, owner, prop.type.vision);
  }

  default void addVision(int x, int y, Player owner, int range) {
    modifyVision(x, y, owner, range, +1);
  }

  default void addUnitVision(int x, int y, Player owner) {
    Unit unit = getGameRound().getMap().getTile(x, y).unit;
    if (owner == null) owner = unit.getOwner();

    addVision(x, y, owner, unit.getType().vision);
  }

  default void addPropertyVision(int x, int y, Player owner) {
    Property prop = getGameRound().getMap().getTile(x, y).property;
    if (owner == null) owner = prop.owner;

    addVision(x, y, owner, prop.type.vision);
  }
}
