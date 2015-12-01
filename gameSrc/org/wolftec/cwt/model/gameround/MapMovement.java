package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.collection.MatrixSegment;
import org.wolftec.cwt.core.collection.RingList;
import org.wolftec.cwt.model.actions.MoveCodes;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;

public class MapMovement {

  private final TileMap map;
  private final Movepath path;
  private final Unit unit;
  private final MoveType movetype;
  private boolean trapped;

  public MapMovement(TileMap map, Unit unit, MoveType unitMovetype) {
    this.map = map;
    this.path = new Movepath();
    this.unit = unit;
    this.movetype = unitMovetype;
  }

  public boolean isTrapped() {
    return trapped;
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
  public void move(int x, int y, RingList<Integer> movePath, boolean noFuelConsumption, boolean preventRemoveOldPos, boolean preventSetNewPos) {
    int team = unit.owners.getOwner().team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    int cX = x;
    int cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos != true) {
      map.getTile(x, y).unit = null;
    }

    UnitType uType = unit.type;
    MoveType mType = movetype;
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

        case MoveCodes.MOVE_CODES_UP:
          cY--;
          break;

        case MoveCodes.MOVE_CODES_RIGHT:
          cX++;
          break;

        case MoveCodes.MOVE_CODES_DOWN:
          cY++;
          break;

        case MoveCodes.MOVE_CODES_LEFT:
          cX--;
          break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does
      // not consume fuel
      if (!noFuelConsumption) {
        fuelUsed += mType.getCostsToMoveOn(map.getTile(cX, cY));
      }

      Unit tileUnit = map.getTile(cX, cY).unit;

      // movable when tile is empty or the last tile in the way while
      // the unit on the tile belongs to the movers owner
      if (!NullUtil.isPresent(tileUnit) || (tileUnit.owners.getOwner() == unit.owners.getOwner() && i == e - 1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

        // enemy unit
      } else if (tileUnit.owners.getOwner().team != team) {
        movePath.clearFromIndex(lastIndex + 1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (!noFuelConsumption) {
      unit.supplies.fuel -= lastFuel;
    }

    // sometimes we prevent to set the unit at the target position because it
    // moves
    // into a thing at a target position (like a transporter)
    if (!preventSetNewPos) {
      map.getTile(lastX, lastY).unit = unit;
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
  private boolean isGoBackCommand(Integer code, RingList<Integer> movePath) {
    int lastCode = movePath.getLast();
    int goBackCode = 0;

    // get go back code
    switch (code) {

      case MoveCodes.MOVE_CODES_UP:
        goBackCode = MoveCodes.MOVE_CODES_DOWN;
        break;

      case MoveCodes.MOVE_CODES_DOWN:
        goBackCode = MoveCodes.MOVE_CODES_UP;
        break;

      case MoveCodes.MOVE_CODES_LEFT:
        goBackCode = MoveCodes.MOVE_CODES_RIGHT;
        break;

      case MoveCodes.MOVE_CODES_RIGHT:
        goBackCode = MoveCodes.MOVE_CODES_LEFT;
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
  public boolean addCodeToMovePath(Integer code, RingList<Integer> movePath, MatrixSegment selection, int sx, int sy) {

    // drop last move code when the new command realizes a move back schema
    if (movePath.getSize() > 0 && isGoBackCommand(code, movePath)) {
      movePath.popLast();
      return true;
    }

    int cx;
    int cy;

    Tile source = map.getTile(sx, sy);
    Unit unit = source.unit;
    int points = unit.type.range;
    int fuelLeft = unit.supplies.fuel;

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

        case MoveCodes.MOVE_CODES_UP:
          ty--;
          break;

        case MoveCodes.MOVE_CODES_LEFT:
          tx--;
          break;

        case MoveCodes.MOVE_CODES_DOWN:
          ty++;
          break;

        case MoveCodes.MOVE_CODES_RIGHT:
          tx++;
          break;
      }
    }

    cx = sx;
    cy = sy;
    for (int i = 0, e = movePath.getSize() - 1; i < e; i++) {
      switch (movePath.get(i)) {

        case MoveCodes.MOVE_CODES_UP:
          cy--;
          break;

        case MoveCodes.MOVE_CODES_LEFT:
          cx--;
          break;

        case MoveCodes.MOVE_CODES_DOWN:
          cy++;
          break;

        case MoveCodes.MOVE_CODES_RIGHT:
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

        case MoveCodes.MOVE_CODES_UP:
          cy--;
          break;

        case MoveCodes.MOVE_CODES_LEFT:
          cx--;
          break;

        case MoveCodes.MOVE_CODES_DOWN:
          cy++;
          break;

        case MoveCodes.MOVE_CODES_RIGHT:
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

  private boolean trapCheck(Battlefield model, RingList<Integer> movePath, PositionData source, PositionData target) {
    NullUtil.getOrThrow(source.unit);

    int cBx = 0;
    int cBy = 0;
    int cx = source.x;
    int cy = source.y;
    int teamId = source.unit.owners.getOwner().team;
    for (int i = 0, e = movePath.getSize(); i < e; i++) {
      switch (movePath.get(i)) {
        case MoveCodes.MOVE_CODES_DOWN:
          cy++;
          break;

        case MoveCodes.MOVE_CODES_UP:
          cy--;
          break;

        case MoveCodes.MOVE_CODES_LEFT:
          cx--;
          break;

        case MoveCodes.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      Unit unit = map.getTile(cx, cy).unit;
      if (unit == null) {

        // no unit there? then it's a valid position
        cBx = cx;
        cBy = cy;

      } else if (teamId != unit.owners.getOwner().team) {

        model.updatePositionData(target, cBx, cBy);
        movePath.set(i, Constants.INACTIVE);

        return true;
      }
    }

    return false;
  }
}
