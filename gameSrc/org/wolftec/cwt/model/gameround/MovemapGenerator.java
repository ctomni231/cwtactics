package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.collection.MatrixSegment;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;

public class MovemapGenerator {

  /**
   * Little helper array object for `model.move_fillMoveMap`. This will be used
   * only by one process. If the helper is not available then a temp object will
   * be created in `model.move_fillMoveMap`. If the engine is used without
   * client hacking then this situation never happen and the
   * `model.move_fillMoveMap` will use this helper to prevent unnecessary array
   * creation.
   */
  private final Array<Integer> fillMoveMapHelper;

  private final Array<Integer> checkArray;

  private boolean inUse;

  public MovemapGenerator() {
    fillMoveMapHelper = JSCollections.$array();
    checkArray = JSCollections.$array();
    for (int i = 0; i < 8; i++) {
      checkArray.push(Constants.INACTIVE);
    }
  }

  /**
   * Fills a **selection** map for move able tiles. If no explicit start
   * position (**x**,**y**) and moving **unit** is given, then the **source**
   * position object will be used to extract data.
   * 
   * @param source
   * @param selection
   * @param x
   * @param y
   * @param unit
   */
  // TODO @ME REFA THIS MONSTER O_O !!!!
  public void fillMoveMap(TileMap map, MoveType mType, PositionData source, MatrixSegment selection) {
    inUse = true;
    AssertUtil.assertThat(!inUse);

    NullUtil.getOrThrow(source.unit);

    int cost;
    int x = source.x;
    int y = source.y;
    Unit unit = source.unit;
    Array<Integer> checker;
    Array<Integer> toBeChecked;
    boolean releaseHelper = false;

    // use the cached array
    toBeChecked = fillMoveMapHelper;
    checker = checkArray;

    // reset some stuff
    for (int n = 0, ne = toBeChecked.$length(); n < ne; n++) {
      toBeChecked.$set(n, Constants.INACTIVE);
    }
    for (int n = 0, ne = checker.$length(); n < ne; n++) {
      checker.$set(n, Constants.INACTIVE);
    }

    int range = unit.type.range;
    Player player = unit.owners.getOwner();

    // decrease range if not enough fuel is available
    if (unit.supplies.fuel < range) {
      range = unit.supplies.fuel;
    }

    // add start tile to the map
    selection.setCenter(x, y, Constants.INACTIVE);
    selection.setValue(x, y, range);

    // fill map ( one structure is X;Y;LEFT_POINTS )
    toBeChecked.$set(0, x);
    toBeChecked.$set(1, y);
    toBeChecked.$set(2, range);

    while (true) {
      int cHigh = -1;
      int cHighIndex = -1;

      for (int i = 0, e = toBeChecked.$length(); i < e; i += 3) {
        int leftPoints = toBeChecked.$get(i + 2);

        if (NullUtil.isPresent(leftPoints) && leftPoints != Constants.INACTIVE) {
          if (cHigh == -1 || leftPoints > cHigh) {
            cHigh = leftPoints;
            cHighIndex = i;
          }
        }
      }

      if (cHighIndex == Constants.INACTIVE) {
        break;
      }

      int cx = toBeChecked.$get(cHighIndex);
      int cy = toBeChecked.$get(cHighIndex + 1);
      int cp = toBeChecked.$get(cHighIndex + 2);

      // clear
      toBeChecked.$set(cHighIndex, Constants.INACTIVE);
      toBeChecked.$set(cHighIndex + 1, Constants.INACTIVE);
      toBeChecked.$set(cHighIndex + 2, Constants.INACTIVE);

      // set neighbors for check_
      if (cx > 0) {
        checker.$set(0, cx - 1);
        checker.$set(1, cy);
      } else {
        checker.$set(0, -1);
        checker.$set(1, -1);
      }
      if (cx < map.mapWidth - 1) {
        checker.$set(2, cx + 1);
        checker.$set(3, cy);
      } else {
        checker.$set(2, -1);
        checker.$set(3, -1);
      }
      if (cy > 0) {
        checker.$set(4, cx);
        checker.$set(5, cy - 1);
      } else {
        checker.$set(4, -1);
        checker.$set(5, -1);
      }
      if (cy < map.mapHeight - 1) {
        checker.$set(6, cx);
        checker.$set(7, cy + 1);
      } else {
        checker.$set(6, -1);
        checker.$set(7, -1);
      }

      // check_ the given neighbors for move
      for (int n = 0; n < 8; n += 2) {
        if (checker.$get(n) == Constants.INACTIVE) {
          continue;
        }

        int tx = checker.$get(n);
        int ty = checker.$get(n + 1);

        cost = mType.getCostsToMoveOn(map.getTile(tx, ty));
        if (cost != -1) {

          Tile cTile = map.getTile(tx, ty);
          Unit cUnit = cTile.unit;

          if (cUnit != null && cTile.data.visionTurnOwner > 0 && !cUnit.hide.isHidden() && cUnit.owners.getOwner().team != player.team) {
            continue;
            // TODO visible enemy hidden
            // TODO own hidden transporter
          }

          int rest = cp - cost;
          if (rest >= 0 && rest > selection.getValue(tx, ty)) {

            // add possible move to the `selection` map
            selection.setValue(tx, ty, rest);

            // add this tile to the checker
            for (int i = 0, e = toBeChecked.$length(); i <= e; i += 3) {
              if (toBeChecked.$get(i) == Constants.INACTIVE || i == e) {
                toBeChecked.$set(i, tx);
                toBeChecked.$set(i + 1, ty);
                toBeChecked.$set(i + 2, rest);
                break;
              }
            }
          }
        }
      }
    }

    int xe, ye;

    // convert left points back to absolute costs
    for (x = 0, xe = map.mapWidth; x < xe; x++) {
      for (y = 0, ye = map.mapHeight; y < ye; y++) {
        if (selection.getValue(x, y) != Constants.INACTIVE) {
          cost = mType.getCostsToMoveOn(map.getTile(x, y));
          selection.setValue(x, y, cost);
        }
      }
    }

    inUse = false;
  }
}
