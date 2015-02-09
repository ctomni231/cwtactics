package org.wolfTec.cwt.game.gamelogic;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.model.Player;
import net.wolfTec.wtEngine.model.Property;
import net.wolfTec.wtEngine.model.Unit;

public interface FogLogic extends BaseLogic {

  default void modifyVision (int x, int y, Player owner,int  range, int value) {

   // ignore neutral objects
   if (owner.team == Constants.INACTIVE_ID) return;

   if (cfgFogEnabled.value != 1) return;

   var clientVisible = owner.clientVisible;
   var turnOwnerVisible = owner.turnOwnerVisible;

   // no active player owns this vision
   if (!clientVisible && !turnOwnerVisible) return;

   var map = model.mapData;
   if (range === 0) {
       if (clientVisible) map[x][y].visionClient += value;
       if (turnOwnerVisible) map[x][y].visionTurnOwner += value;

   } else {
       var mW = model.mapWidth;
       var mH = model.mapHeight;
       var lX;
       var hX;
       var lY = y - range;
       var hY = y + range;

       if (lY < 0) lY = 0;
       if (hY >= mH) hY = mH - 1;
       for (; lY <= hY; lY++) {

           var disY = Math.abs(lY - y);
           lX = x - range + disY;
           hX = x + range - disY;
           if (lX < 0) lX = 0;
           if (hX >= mW) hX = mW - 1;
           for (; lX <= hX; lX++) {

               // does the tile block vision ?
               if (map[lX][lY].type.blocksVision && model.getDistance(x, y, lX, lY) > 1) continue;

               if (clientVisible) map[lX][lY].visionClient += value;
               if (turnOwnerVisible) map[lX][lY].visionTurnOwner += value;
           }
       }
   }
}
  

  default void fullRecalculation() {
    int x;
    int y;
    int xe = model.mapWidth;
    int ye = model.mapHeight;
    boolean fogEnabled = (cfgFogEnabled.value === 1);
    var map = model.mapData;

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {

            if (!fogEnabled) {
                map[x][y].visionTurnOwner = 1;
                map[x][y].visionClient = 1;
            } else {
                map[x][y].visionTurnOwner = 0;
                map[x][y].visionClient = 0;
            }
        }
    }

    // 2. add vision-object
    if (fogEnabled) {
        var vision;
        var unit;
        var tile;
        var property;

        for (x = 0; x < xe; x++) {
            for (y = 0; y < ye; y++) {
                tile = map[x][y];

                unit = tile.unit;
                if (unit !== null) {
                    vision = unit.type.vision;
                    if (vision < 0) vision = 0;

                    modifyVision_(x, y, unit.owner, vision, 1);
                }

                property = tile.property;
                if (property !== null && property.owner !== null) {
                    vision = property.type.vision;
                    if (vision < 0) vision = 0;

                    modifyVision_(x, y, property.owner, vision, 1);
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
