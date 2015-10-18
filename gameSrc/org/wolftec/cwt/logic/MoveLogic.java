package org.wolftec.cwt.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.collections.CircularBuffer;
import org.wolftec.cwt.core.collections.MoveableMatrix;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.MoveType;
import org.wolftec.cwt.model.sheets.types.UnitType;

public class MoveLogic implements Injectable {

  /* --------------- start a-star API --------------- */

  @GlobalScope
  @STJSBridge
  private static class Window {
    static AStar astar;
  }

  @STJSBridge
  private static class AStar {
    native Array<Node> search(Array<Array<Node>> nodes, Node start, Node end);
  }

  @STJSBridge
  private static class Graph {

    @Native
    Graph(Array<Array<Integer>> data) {
    }

    Array<Array<Node>> nodes;
  }

  @STJSBridge
  private static class Node {
    int x;
    int y;
  }

  /* --------------- end a-star API --------------- */

  private static final String NO_UNIT_AT_POSITION_ERROR = "NoUnitAtPosition";

  public static final int MOVE_CODES_UP    = 0;
  public static final int MOVE_CODES_RIGHT = 1;
  public static final int MOVE_CODES_DOWN  = 2;
  public static final int MOVE_CODES_LEFT  = 3;

  private ModelManager model;
  private SheetManager sheets;
  private FogLogic     fog;

  /**
   * Little helper array object for `model.move_fillMoveMap`. This will be used
   * only by one process. If the helper is not available then a temp object will
   * be created in `model.move_fillMoveMap`. If the engine is used without
   * client hacking then this situation never happen and the
   * `model.move_fillMoveMap` will use this helper to prevent unnecessary array
   * creation.
   */
  private Array<Integer> fillMoveMapHelper;

  private Array<Integer> checkArray;

  @Override
  public void onConstruction() {
    fillMoveMapHelper = JSCollections.$array();
    checkArray = JSCollections.$array();
    for (int i = 0; i < 8; i++) {
      checkArray.push(Constants.INACTIVE);
    }
  }

  public int codeFromAtoB(int sx, int sy, int tx, int ty) {
    int code = 0;

    if (sx < tx) {
      code = MOVE_CODES_RIGHT;

    } else if (sx > tx) {
      code = MOVE_CODES_LEFT;

    } else if (sy < ty) {
      code = MOVE_CODES_DOWN;

    } else if (sy > ty) {
      code = MOVE_CODES_UP;

    } else {
      JsUtil.throwError("IllegalMoveCode");
    }

    return code;
  }

  /**
   * @param movetype
   * @param x
   * @param y
   * @return move cost to move with a given move type on a given tile type
   */
  public int getMoveCosts(MoveType movetype, int x, int y) {
    if (!model.isValidPosition(x, y)) {
      JsUtil.throwError("IllegalPosition");
    }

    int v;
    Tile tile = model.getTile(x, y);

    // grab costs from property or if not given from tile
    boolean block;
    // TODO
    if (tile.type.visionBlocker) {
      v = -1;
    } else {
      v = movetype.costs.$get(tile.type.ID);
    }

    if (NullUtil.isPresent(v)) {
      return v;
    }

    // check wildcard
    v = movetype.costs.$get("*");
    if (NullUtil.isPresent(v)) {
      return v;
    }

    // no match then return `-1`as not move able
    return Constants.INACTIVE;
  }

  /**
   * Returns **true** if a **moveType** can move to a position (**x**,**y**),
   * else **false**.
   * 
   * @param moveType
   * @param x
   * @param y
   * @return
   */
  public boolean canTypeMoveTo(MoveType moveType, int x, int y) {

    // check technical movement to tile type
    if (getMoveCosts(moveType, x, y) == Constants.INACTIVE) {
      return false;
    }

    // check some other rules like fog and units
    Tile tile = model.getTile(x, y);
    return (tile.visionTurnOwner == 0 || !NullUtil.isPresent(tile.unit));
  }

  /**
   * Generates a path from a start position (**stx**,**sty**) to (**tx**,**ty**)
   * with a given **selection** map. The result path will be stored in the
   * **movePath**.
   * 
   * @param stx
   * @param sty
   * @param tx
   * @param ty
   * @param selection
   * @param movePath
   */
  public void generateMovePath(int stx, int sty, int tx, int ty, MoveableMatrix selection, CircularBuffer<Integer> movePath) {
    int dsx = stx - selection.getCenterX();
    int dsy = sty - selection.getCenterY();
    int dtx = tx - selection.getCenterX();
    int dty = ty - selection.getCenterY();

    // generate path by the a-star library
    Array<Array<Integer>> matrix = selection.getDataArray();
    Graph graph = JSObjectAdapter.$js("new Graph(matrix)"); // TODO
    Node start = graph.nodes.$get(dsx).$get(dsy);
    Node end = graph.nodes.$get(dtx).$get(dty);
    Array<Node> path = Window.astar.search(graph.nodes, start, end);

    // extract data from generated path map and fill the movePath object
    movePath.clear();

    int cx = stx;
    int cy = sty;
    for (int i = 0, e = path.$length(); i < e; i++) {
      Node cNode = path.$get(i);

      // add code to move path
      movePath.push(codeFromAtoB(cx, cy, cNode.x, cNode.y));

      /*
       * we need to update the current position to generate a correct move code
       * in the next iteration step
       */
      cx = cNode.x;
      cy = cNode.y;
    }
  }

  /**
   * Compares a given move **code** with a **movePath**. When the new code is
   * the exact opposite direction of the last command in the path then **true**
   * will be return else **false**.
   * 
   * @param code
   * @param movePath
   * @return
   */
  private boolean isGoBackCommand(Integer code, CircularBuffer<Integer> movePath) {
    int lastCode = movePath.getLast();
    int goBackCode = 0;

    // get go back code
    switch (code) {

      case MOVE_CODES_UP:
        goBackCode = MOVE_CODES_DOWN;
        break;

      case MOVE_CODES_DOWN:
        goBackCode = MOVE_CODES_UP;
        break;

      case MOVE_CODES_LEFT:
        goBackCode = MOVE_CODES_RIGHT;
        break;

      case MOVE_CODES_RIGHT:
        goBackCode = MOVE_CODES_LEFT;
        break;
    }

    return (lastCode == goBackCode);
  }

  /**
   * Appends a move `code` to a given `movePath` and returns `true` if the
   * insertion was possible else `false`. If the new code is a backwards move to
   * the previous tile in the path then the actual last tile will be dropped. In
   * this function returns also `true` in this case.
   * 
   * @param code
   * @param movePath
   * @param selection
   * @param sx
   * @param sy
   * @return
   */
  public boolean addCodeToMovePath(Integer code, CircularBuffer<Integer> movePath, MoveableMatrix selection, int sx, int sy) {

    // drop last move code when the new command realizes a move back schema
    if (movePath.getSize() > 0 && isGoBackCommand(code, movePath)) {
      movePath.popLast();
      return true;
    }

    int cx;
    int cy;

    Tile source = model.getTile(sx, sy);
    Unit unit = source.unit;
    int points = unit.type.range;
    int fuelLeft = unit.fuel;

    // decrease move range when not enough fuel is available to
    // move the maximum possible range for the selected move type
    if (fuelLeft < points) {
      points = fuelLeft;
    }

    // add command to the move path list
    movePath.push(code);

    int tx = sx;
    int ty = sy;
    for (int i = 0, e = movePath.getSize(); i < e; i++) {
      switch (movePath.get(i)) {

        case MOVE_CODES_UP:
          ty--;
          break;

        case MOVE_CODES_LEFT:
          tx--;
          break;

        case MOVE_CODES_DOWN:
          ty++;
          break;

        case MOVE_CODES_RIGHT:
          tx++;
          break;
      }
    }

    cx = sx;
    cy = sy;
    for (int i = 0, e = movePath.getSize() - 1; i < e; i++) {
      switch (movePath.get(i)) {

        case MOVE_CODES_UP:
          cy--;
          break;

        case MOVE_CODES_LEFT:
          cx--;
          break;

        case MOVE_CODES_DOWN:
          cy++;
          break;

        case MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      if (tx == cx && ty == cy) {
        movePath.clearFromIndex(i + 1);
        break;
      }
    }

    // calculate fuel consumption for the current move path
    cx = sx;
    cy = sy;
    int fuelUsed = 0;
    for (int i = 0, e = movePath.getSize(); i < e; i++) {
      switch (movePath.get(i)) {

        case MOVE_CODES_UP:
          cy--;
          break;

        case MOVE_CODES_LEFT:
          cx--;
          break;

        case MOVE_CODES_DOWN:
          cy++;
          break;

        case MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      // **add fuel consumption to total consumption here**
      fuelUsed += selection.getValue(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      movePath.popLast();
      return false;
    } else {
      return true;
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
  public void fillMoveMap(PositionData source, MoveableMatrix selection) {
    NullUtil.mustBePresent(source.unit, NO_UNIT_AT_POSITION_ERROR);

    // TODO: source and x,y,unit is kinda double definition of the same things
    int cost;

    int x = source.x;
    int y = source.y;
    Unit unit = source.unit;

    Array<Integer> checker;
    Array<Integer> toBeChecked;
    boolean releaseHelper = false;
    if (fillMoveMapHelper != null) {

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

      // remove cache objects from the move logic object
      fillMoveMapHelper = null;
      checkArray = null;

      releaseHelper = true;

    } else {
      // use a new arrays because cache objects aren't available
      toBeChecked = JSCollections.$array();
      checker = JSCollections.$array();
      for (int i = 0; i < 8; i++) {
        checker.push(Constants.INACTIVE);
      }
    }

    MoveType mType = sheets.movetypes.get(unit.type.movetype);
    int range = unit.type.range;
    Player player = unit.owner;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) {
      range = unit.fuel;
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
      if (cx < model.mapWidth - 1) {
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
      if (cy < model.mapHeight - 1) {
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

        cost = getMoveCosts(mType, tx, ty);
        if (cost != -1) {

          Tile cTile = model.getTile(tx, ty);
          Unit cUnit = cTile.unit;

          if (cUnit != null && cTile.visionTurnOwner > 0 && !cUnit.hidden && cUnit.owner.team != player.team) {
            continue;
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

    // release helper if you grabbed it
    if (releaseHelper) {
      fillMoveMapHelper = toBeChecked;
      checkArray = checker;
    }

    int xe, ye;

    // convert left points back to absolute costs
    for (x = 0, xe = model.mapWidth; x < xe; x++) {
      for (y = 0, ye = model.mapHeight; y < ye; y++) {
        if (selection.getValue(x, y) != Constants.INACTIVE) {
          cost = getMoveCosts(mType, x, y);
          selection.setValue(x, y, cost);
        }
      }
    }
  }

  public boolean trapCheck(ModelManager model, CircularBuffer<Integer> movePath, PositionData source, PositionData target) {
    NullUtil.mustBePresent(source.unit, NO_UNIT_AT_POSITION_ERROR);

    int cBx = 0;
    int cBy = 0;
    int cx = source.x;
    int cy = source.y;
    int teamId = source.unit.owner.team;
    for (int i = 0, e = movePath.getSize(); i < e; i++) {
      switch (movePath.get(i)) {
        case MOVE_CODES_DOWN:
          cy++;
          break;

        case MOVE_CODES_UP:
          cy--;
          break;

        case MOVE_CODES_LEFT:
          cx--;
          break;

        case MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      Unit unit = model.getTile(cx, cy).unit;
      if (unit == null) {

        // no unit there? then it's a valid position
        cBx = cx;
        cBy = cy;

      } else if (teamId != unit.owner.team) {

        target.set(model, cBx, cBy); // ? this looks ugly here...
        movePath.set(i, Constants.INACTIVE);

        return true;
      }
    }

    return false;
  }

  /**
   * 
   * @param unit
   * @param x
   * @param y
   * @param movePath
   * @param noFuelConsumption
   * @param preventRemoveOldPos
   * @param preventSetNewPos
   */
  public void move(Unit unit, int x, int y, CircularBuffer<Integer> movePath, boolean noFuelConsumption, boolean preventRemoveOldPos,
      boolean preventSetNewPos) {

    int team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    int cX = x;
    int cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos != true) {
      fog.removeUnitVision(x, y, unit.owner);
      model.getTile(x, y).unit = null;
    }

    UnitType uType = unit.type;
    MoveType mType = sheets.movetypes.get(uType.movetype);
    int fuelUsed = 0;

    // check move way by iterate through all move codes and build the path
    //
    // 1. check the correctness of the given move code
    // 2. check all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //

    int lastX = -1;
    int lastY = -1;
    int lastFuel = 0;
    int lastIndex = 0;
    boolean trapped = false;
    for (int i = 0, e = movePath.getSize(); i < e; i++) {

      // set current position by current move code
      switch (movePath.get(i)) {

        case MOVE_CODES_UP:
          cY--;
          break;

        case MOVE_CODES_RIGHT:
          cX++;
          break;

        case MOVE_CODES_DOWN:
          cY++;
          break;

        case MOVE_CODES_LEFT:
          cX--;
          break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does
      // not consume fuel
      if (!noFuelConsumption) {
        fuelUsed += getMoveCosts(mType, cX, cY);
      }

      Unit tileUnit = model.getTile(cX, cY).unit;

      // movable when tile is empty or the last tile in the way while
      // the unit on the tile belongs to the movers owner
      if (!NullUtil.isPresent(tileUnit) || (tileUnit.owner == unit.owner && i == e - 1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

        // enemy unit
      } else if (tileUnit.owner.team != team) {
        movePath.clearFromIndex(lastIndex + 1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (!noFuelConsumption) {
      unit.fuel -= lastFuel;
    }

    // sometimes we prevent to set the unit at the target position because it
    // moves
    // into a thing at a target position (like a transporter)
    if (!preventSetNewPos) {
      model.getTile(lastX, lastY).unit = unit;
      fog.addUnitVision(lastX, lastY, unit.owner);
    }
  }

  /**
   * 
   * @param model
   * @param position
   * @return true when the unit can move somewhere starting from the given
   *         position, else false
   */
  public boolean canMoveSomewhere(ModelManager model, PositionData position) {
    NullUtil.mustBePresent(position.unit, NO_UNIT_AT_POSITION_ERROR);

    Unit unit = position.unit;
    MoveType mv = sheets.movetypes.get(unit.type.movetype);

    return ((model.isValidPosition(position.x + 1, position.y) && getMoveCosts(mv, position.x + 1, position.y) > Constants.INACTIVE)
        || (model.isValidPosition(position.x - 1, position.y) && getMoveCosts(mv, position.x - 1, position.y) > Constants.INACTIVE)
        || (model.isValidPosition(position.x, position.y - 1) && getMoveCosts(mv, position.x, position.y - 1) > Constants.INACTIVE)
        || (model.isValidPosition(position.x, position.y + 1) && getMoveCosts(mv, position.x, position.y + 1) > Constants.INACTIVE));
  }
}
