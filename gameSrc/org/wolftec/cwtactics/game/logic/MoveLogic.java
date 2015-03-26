package org.wolftec.cwtactics.game.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.managers.TypeManager;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Player;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.cwtactics.game.domain.types.MoveType;
import org.wolftec.cwtactics.game.domain.types.UnitType;
import org.wolftec.wCore.container.CircularBuffer;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wCore.container.MoveableMatrix;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wPlay.layergfx.DirectionUtil.Direction;
import org.wolftec.wPlay.pathfinding.PathFinder;

@ManagedComponent
public class MoveLogic implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger LOG;

  @Injected
  private GameManager gameround;

  @Injected
  private PathFinder pathfinder;

  @Injected
  private FogLogic fog;

  @Injected
  private TypeManager types;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    helper = ContainerUtil.createArray();
    checkHelper = ContainerUtil.createArray();

    checkHelper.push(EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID,
        EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID,
        EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID);
  }

  /**
   * Extracts the move code between two positions.
   * 
   * @param sx
   * @param sy
   * @param tx
   * @param ty
   * @return
   */
  public MoveCode codeFromAtoB(int sx, int sy, int tx, int ty) {
    MoveCode code = null;
    if (sx < tx) {
      code = MoveCode.RIGHT;
    } else if (sx > tx) {
      code = MoveCode.LEFT;
    } else if (sy < ty) {
      code = MoveCode.DOWN;
    } else if (sy > ty) {
      code = MoveCode.UP;
    }

    return code;
  }

  /**
   * Returns the move cost to move with a given move type on a given tile type.
   * 
   * @param movetype
   * @param x
   * @param y
   * @return
   */
  public int getMoveCosts(MoveType movetype, int x, int y) {
    int v;
    Tile tile = gameround.getTile(x, y);

    // grab costs from property or if not given from tile
    // TODO
    boolean blocks = JsExec.injectJS("(tile.property != null) ? "
        + "tile.property.type.blocksVision : tile.type.blocksVision");
    if (tile.type.blocksVision) {
      return EngineGlobals.INACTIVE_ID;
    } else {
      if (JSObjectAdapter.hasOwnProperty(movetype.costs, tile.type.ID)) {
        return movetype.costs.$get(tile.type.ID);
      }
    }

    // check wildcard
    if (JSObjectAdapter.hasOwnProperty(movetype.costs, "*")) {
      return movetype.costs.$get("*");
    }

    // no match then return `-1`as not move able
    return EngineGlobals.INACTIVE_ID;
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
    if (getMoveCosts(moveType, x, y) == EngineGlobals.INACTIVE_ID) {
      return false;
    }

    // check some other rules like fog and units
    Tile tile = gameround.getTile(x, y);
    return (tile.visionTurnOwner == 0 || tile.unit == null);
  }

  public boolean willBeTrapped() {
    return false; // TODO
  }

  /**
   * 
   * @param sx
   *          start position x
   * @param sy
   *          start position y
   * @param path
   *          path that will be checked and manipulated (when a block is given)
   * @return true, when the path is blocked, else false
   */
  public boolean stopPathWhenMoveTrapIsGiven(int sx, int sy, CircularBuffer<Direction> path) {
    int cBx;
    int cBy;
    int cx = sx;
    int cy = sy;

    Unit mover = gameround.getTile(sx, sy).unit;
    if (mover == null) {
      JsUtil.raiseError("MissingUnit");
    }

    int teamId = mover.owner.team;
    for (int i = 0, e = path.getSize(); i < e; i++) {
      switch (path.get(i)) {
        case DOWN:
          cy++;
          break;

        case UP:
          cy--;
          break;

        case LEFT:
          cx--;
          break;

        case RIGHT:
          cx++;
          break;
      }

      Unit unit = gameround.getTile(cx, cy).unit;
      if (unit == null) {
        cBx = cx;
        cBy = cy;

        // allow moving through own and allied units, enemy units invokes a move
        // block
      } else if (teamId != unit.owner.team) {
        path.set(i, null);
        return true;
      }
    }

    return false;
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
   * @param path
   *          (optional)
   * @return
   */
  public CircularBuffer<Direction> generatePath(int stx, int sty, int tx, int ty,
      MoveableMatrix selection, CircularBuffer<Direction> path) {

    Array<Direction> dirPath = pathfinder.findPath(selection, stx, sty, tx, ty);
    if (path == null) {
      path = new CircularBuffer<Direction>(EngineGlobals.MAX_SELECTION_RANGE);
    }

    for (int i = 0; i < dirPath.$length(); i++) {
      path.push(dirPath.$get(i));
    }

    return path;
  }

  /**
   * Compares a given move code with the movePath.
   * 
   * @param code
   * @return When the new code is the exact opposite direction of the last
   *         command in the path then true will be return else false
   */
  public boolean isGoBackCommand(Direction code, CircularBuffer<Direction> path) {
    if (path.getSize() == 0) {
      return false;
    }

    Direction lastCode = path.get(path.getSize() - 1);
    Direction goBackCode = null;

    // get go back code
    switch (code) {

      case UP:
        goBackCode = Direction.DOWN;
        break;

      case DOWN:
        goBackCode = Direction.UP;
        break;

      case LEFT:
        goBackCode = Direction.RIGHT;
        break;

      case RIGHT:
        goBackCode = Direction.LEFT;
        break;

      default:
        JsUtil.raiseError("unknown move code");
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
   * @param selection
   * @param sx
   * @param sy
   */
  public boolean addCode(Direction code, CircularBuffer<Direction> path, MoveableMatrix selection,
      int sx, int sy) {

    if (isGoBackCommand(code, path)) {
      path.popLast();
      return true;
    }

    Tile source = gameround.getTile(sx, sy);
    Unit unit = source.unit;
    int points = unit.type.range;
    int fuelLeft = unit.fuel;

    // decrease move range when not enough fuel is available to
    // move the maximum possible range for the selected move type
    if (fuelLeft < points) {
      points = fuelLeft;
    }

    // add command to the move path list
    path.push(code);

    // calculate fuel consumption for the current move path
    int cx = sx;
    int cy = sy;
    int fuelUsed = 0;
    for (int i = 0, e = path.getSize(); i < e; i++) {
      switch (path.get(i)) {

        case UP:
        case LEFT:
          cy--;
          break;

        case DOWN:
        case RIGHT:
          cx++;
          break;
      }

      // **add fuel consumption to total consumption here**
      fuelUsed += selection.getValue(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      path.popLast();
      return false;
    } else {
      return true;
    }
  }

  /**
   * Little helper array object for `model.move_fillMoveMap`. This will be used
   * only by one process. If the helper is not available then a temporary object
   * will be created in `model.move_fillMoveMap`. If the engine is used without
   * client hacking then this situation never happen and the
   * `model.move_fillMoveMap` will use this helper to prevent unnecessary array
   * creation.
   */
  private Array<Integer> helper;

  private Array<Integer> checkHelper;

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
  public void fillMoveMap(int x, int y, Unit unit, MoveableMatrix selection) {

    // TODO XXX remove complexity // may a circular buffer helps

    int cost;
    Array<Integer> checker;

    if (!gameround.isValidPosition(x, y)) {
      JsUtil.raiseError("IllegalPosition");
    }

    Array<Integer> toBeChecked;
    boolean releaseHelper = false;
    if (helper != null) {

      // use the cached array
      toBeChecked = this.helper;
      checker = this.checkHelper;

      // reset some stuff
      for (int n = 0, ne = toBeChecked.$length(); n < ne; n++) {
        toBeChecked.$set(n, EngineGlobals.INACTIVE_ID);
      }
      for (int n = 0, ne = checker.$length(); n < ne; n++) {
        checker.$set(n, EngineGlobals.INACTIVE_ID);
      }

      // remove cache objects from the move logic object
      this.helper = null;
      this.checkHelper = null;

      releaseHelper = true;

    } else {
      LOG.warn("cannot use move cache variables => creating temporary ones as fallback");

      // use a new arrays because cache objects aren't available
      toBeChecked = ContainerUtil.createArray();
      checker = ContainerUtil.createArray();
      checker.push(EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID,
          EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID,
          EngineGlobals.INACTIVE_ID, EngineGlobals.INACTIVE_ID);
    }

    MoveType mType = types.getMoveType(unit.type.movetype);
    int range = unit.type.range;
    Player player = unit.owner;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) {
      range = unit.fuel;
    }

    // add start tile to the map
    selection.setCenter(x, y, EngineGlobals.INACTIVE_ID);
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

        if (leftPoints != EngineGlobals.INACTIVE_ID) {
          if (cHigh == -1 || leftPoints > cHigh) {
            cHigh = leftPoints;
            cHighIndex = i;
          }
        }
      }
      if (cHighIndex == -1) break;

      int cx = toBeChecked.$get(cHighIndex);
      int cy = toBeChecked.$get(cHighIndex + 1);
      int cp = toBeChecked.$get(cHighIndex + 2);

      // clear
      toBeChecked.$set(cHighIndex, EngineGlobals.INACTIVE_ID);
      toBeChecked.$set(cHighIndex + 1, EngineGlobals.INACTIVE_ID);
      toBeChecked.$set(cHighIndex + 2, EngineGlobals.INACTIVE_ID);

      // set neighbors for check_
      if (cx > 0) {
        checker.$set(0, cx - 1);
        checker.$set(1, cy);
      } else {
        checker.$set(0, -1);
        checker.$set(1, -1);
      }
      if (cx < gameround.mapWidth - 1) {
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
      if (cy < gameround.mapHeight - 1) {
        checker.$set(6, cx);
        checker.$set(7, cy + 1);
      } else {
        checker.$set(6, -1);
        checker.$set(7, -1);
      }

      // check_ the given neighbors for move
      for (int n = 0; n < 8; n += 2) {
        if (checker.$get(n) == -1) {
          continue;
        }

        int tx = checker.$get(n);
        int ty = checker.$get(n + 1);

        cost = getMoveCosts(mType, tx, ty);
        if (cost != -1) {

          Tile cTile = gameround.getTile(tx, ty);
          Unit cUnit = cTile.unit;

          if (cUnit != null && cTile.visionTurnOwner > 0 && !cUnit.hidden
              && cUnit.owner.team != player.team) {
            continue;
          }

          int rest = cp - cost;
          if (rest >= 0 && rest > selection.getValue(tx, ty)) {

            // add possible move to the `selection` map
            selection.setValue(tx, ty, rest);

            // add this tile to the checker
            for (int i = 0, e = toBeChecked.$length(); i <= e; i += 3) {
              if (toBeChecked.$get(i) == EngineGlobals.INACTIVE_ID || i == e) {
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
      this.helper = toBeChecked;
      this.checkHelper = checker;
    }

    // convert left points back to absolute costs
    int xe, ye;
    for (x = 0, xe = gameround.mapWidth; x < xe; x++) {
      for (y = 0, ye = gameround.mapHeight; y < ye; y++) {
        if (selection.getValue(x, y) != EngineGlobals.INACTIVE_ID) {
          cost = getMoveCosts(mType, x, y);
          selection.setValue(x, y, cost);
        }
      }
    }
  }

  /**
   * 
   * @param unit
   * @param x
   * @param y
   * @param path
   * @param noFuelConsumption
   * @param preventRemoveOldPos
   * @param preventSetNewPos
   */
  public void move(Unit unit, int x, int y, CircularBuffer<Direction> path,
      boolean noFuelConsumption, boolean preventRemoveOldPos, boolean preventSetNewPos) {

    int team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    int cX = x;
    int cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos != true) {
      fog.removeUnitVision(x, y, unit.owner);
      gameround.getTile(x, y).unit = null;

      LOG.info("remove unit from position (" + x + "," + y + ")");
    }

    UnitType uType = unit.type;
    MoveType mType = types.getMoveType(uType.movetype);
    int fuelUsed = 0;

    // check_ move way by iterate through all move codes and build the path
    //
    // 1. check_ the correctness of the given move code
    // 2. check_ all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //

    boolean trapped = false;
    int lastX = -1;
    int lastY = -1;
    int lastFuel = 0;
    int lastIndex = 0;
    for (int i = 0, e = path.getSize(); i < e; i++) {

      // set current position by current move code
      switch (path.get(i)) {

        case UP:
          cY--;
          break;

        case RIGHT:
          cX++;
          break;

        case DOWN:
          cY++;
          break;

        case LEFT:
          cX--;
          break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does
      // not consume fuel
      if (noFuelConsumption != true) {
        fuelUsed += getMoveCosts(mType, cX, cY);
      }

      Unit tileUnit = gameround.getTile(cX, cY).unit;

      // movable when tile is empty or the last tile in the way while
      // the unit on the tile belongs to the movers owner
      if (tileUnit == null || (tileUnit.owner == unit.owner && i == e - 1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

        // enemy unit
      } else if (tileUnit.owner.team != team) {
        path.clearFromIndex(lastIndex + 1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (noFuelConsumption != true) {
      unit.fuel -= lastFuel;
      if (unit.fuel < 0) {
        JsUtil.raiseError("IllegalGameState: unit fuel fell below zero");
      }
    }

    // sometimes we prevent to set the unit at the target position because it
    // moves into a thing at a target position (like a transporter)
    if (preventSetNewPos != true) {
      gameround.getTile(lastX, lastY).unit = unit;
      fog.addUnitVision(lastX, lastY, unit.owner);

      LOG.info("set unit to position (" + lastX + "," + lastY + ")");
    }
  }
}
