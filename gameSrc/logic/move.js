/**
 *
 * @namespace
 */
cwt.Move = {

  /**
   * @constant
   */
  MAX_LENGTH: 15,

  /**
   * @constant
   */
  MOVE_CODES_UP: 0,

  /**
   * @constant
   */
  MOVE_CODES_RIGHT: 1,

  /**
   * @constant
   */
  MOVE_CODES_DOWN: 2,

  /**
   * @constant
   */
  MOVE_CODES_LEFT: 3,

  /**
   * Extracts the move code between two positions.
   */
  codeFromAtoB: function (sx, sy, tx, ty) {
    if (DEBUG) assert(cwt.Map.isValidPosition(sx, sy));
    if (DEBUG) assert(cwt.Map.isValidPosition(tx, ty));
    if (DEBUG) assert(cwt.Map.getDistance(sx, sy, tx, ty) === 1);

    if (sx < tx) return this.MOVE_CODES_RIGHT;
    if (sx > tx) return this.MOVE_CODES_LEFT;
    if (sy < ty) return this.MOVE_CODES_DOWN;
    if (sy > ty) return this.MOVE_CODES_UP;

    return cwt.INACTIVE;
  },


  /**
   * Returns the move cost to move with a given move type on a
   * given tile type.
   */
  getMoveCosts: function (movetype, x, y) {
    if (DEBUG) assert(cwt.Map.isValidPosition(x, y));

    var v;
    var tmp = cwt.Map.data[x][y];

    // grab costs from property or  if not given from tile
    tmp = (tmp.property) ? tmp.property : tmp;
    if (tmp.type.blocker) {
      v = -1;
    } else {
      v = movetype.costs[tmp.type.ID];
    }

    if (typeof v === "number") return v;

    // check wildcard
    v = movetype.costs["*"];
    if (typeof v === "number") return v;

    // no match then return `-1`as not move able
    return -1;
  },

  /**
   * Returns true if a movetype can move to position {x,y} else false.
   *
   * @param movetype
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  canTypeMoveTo: function (movetype, x, y) {
    if (cwt.Map.isValidPosition(x, y)) {
      if (this.getMoveCosts(movetype, x, y) === -1) return false;

      var tile = cwt.Map.data[x][y];
      if (tile.visionTurnOwner === 0) return true;
      if (tile.unit) return false;

      return true;
    } else return false;
  },

  /**
   * Generates a path from a start position { `stx` , `sty` } to { `tx` , `ty` } with a
   * given selection ( `util.selectionMap` ) map. The result will be stored in the `movePath`.
   *
   * @param {number} stx
   * @param {number} sty
   * @param {number} tx
   * @param {number} ty
   * @param {cwt.SelectionMap} selection
   * @param movePath
   */
  generateMovePath: function (stx, sty, tx, ty, selection, movePath) {
    if (DEBUG) assert(cwt.Map.isValidPosition(stx, sty));
    if (DEBUG) assert(cwt.Map.isValidPosition(tx, ty));

    var graph = new Graph(selection.data);

    var dsx = stx - selection.centerX;
    var dsy = sty - selection.centerY;
    var start = graph.nodes[dsx][dsy];
    var dtx = tx - selection.centerX;
    var dty = ty - selection.centerY;
    var end = graph.nodes[dtx][dty];
    var path = astar.search(graph.nodes, start, end);
    var cx = stx;
    var cy = sty;
    var cNode;

    movePath.resetValues();
    var movePathIndex = 0;
    for (var i = 0, e = path.length; i < e; i++) {
      cNode = path[i];

      var dir;
      if (cNode.x > cx) dir = this.MOVE_CODES_RIGHT;
      else if (cNode.x < cx) dir = this.MOVE_CODES_LEFT;
      else if (cNode.y > cy) dir = this.MOVE_CODES_DOWN;
      else if (cNode.y < cy) dir = this.MOVE_CODES_UP;
      else assert(false);

      // add code to move path
      movePath[movePathIndex] = dir;
      movePathIndex++;

      cx = cNode.x;
      cy = cNode.y;
    }
  },

  isGoBackCommand_: function (code, movePath) {
    var lastCode = movePath.getLastElement();
    var goBackCode;

    // get go back code
    switch (code) {
      case this.MOVE_CODES_UP:
        goBackCode = this.MOVE_CODES_DOWN;
        break;
      case this.MOVE_CODES_DOWN:
        goBackCode = this.MOVE_CODES_UP;
        break;
      case this.MOVE_CODES_LEFT:
        goBackCode = this.MOVE_CODES_RIGHT;
        break;
      case this.MOVE_CODES_RIGHT:
        goBackCode = this.MOVE_CODES_LEFT;
        break;
    }

    // if move is a go back then pop the lest code
    if (lastCode === goBackCode) {
      movePath.pop();
      return true;
    } else {
      return false;
    }
  },

  /**
   * Appends a move `code` to a given `movePath` and returns `true` if the
   * insertion was possible else `false`. If the new code is a backwards move
   * to the previous tile in the path then the actual last tile will be
   * dropped. In this function returns also `true` in this case.
   *
   * @param {cwt.Move.MOVE_CODES_DOWN|cwt.Move.MOVE_CODES_RIGHT|cwt.Move.MOVE_CODES_LEFT|cwt.Move.MOVE_CODES_UP} code
   * @param {cwt.Array} movePath
   * @param {cwt.SelectionMap} selection
   * @param {number} sx
   * @param {number} sy
   */
  addCodeToMovePath: function (code, movePath, selection, sx, sy) {
    if (DEBUG) assert(code >= this.MOVE_CODES_UP && code <= this.MOVE_CODES_LEFT);

    if (this.isGoBackCommand_(code, movePath)) {
      return true;
    }

    var source = cwt.Map.data[sx][sy];
    var unit = source.unit;
    var fuelLeft = unit.fuel;
    var points = unit.type.range;
    if (fuelLeft < points) points = fuelLeft;

    // add command to the move path list
    movePath.data[movePath.getSize()] = code;

    // calculate fuel consumption for the current move path
    var cx = sx;
    var cy = sy;
    var fuelUsed = 0;
    for (var i = 0, e = movePath.getLastIndex(); i <= e; i++) {
      switch (movePath.data[i]) {

        case this.MOVE_CODES_UP:
          cy--;
          break;

        case this.MOVE_CODES_DOWN:
          cy++;
          break;

        case this.MOVE_CODES_LEFT:
          cx--;
          break;

        case this.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      // acc. fuel consumption
      fuelUsed += selection.getValueAt(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      movePath.data[movePath.getSize() - 1] = cwt.INACTIVE;
      return false;
    } else {
      return true;
    }
  },

  /**
   * Little helper array object for `model.move_fillMoveMap`. This will be used
   * only by one process. If the helper is not available then a temp object will
   * be created in `model.move_fillMoveMap`. If the engine is used without client
   * hacking then this situation never happen and the `model.move_fillMoveMap`
   * will use this helper to prevent unnecessary array creation.
   */
  fillMoveMapHelper_: [],

  /**
   * Fills a move map for possible move able tiles in a selection map.
   *
   * @param source
   * @param selection
   * @param x
   * @param y
   * @param unit
   */
  fillMoveMap: function (source, selection, x, y, unit) {
    var cost;
    var map = cwt.Map.data;

    // grab object aw2 from `source` position if no explicit aw2 is given
    if (typeof x !== "number") x = source.x;
    if (typeof y !== "number") y = source.y;
    if (!unit) unit = source.unit;

    if (DEBUG) assert(cwt.Map.isValidPosition(x, y));

    var toBeChecked;
    var releaseHelper = false;
    if (this.fillMoveMapHelper_ !== null) {
      toBeChecked = this.fillMoveMapHelper_;
      this.fillMoveMapHelper_ = null;
      releaseHelper = true;
    } else toBeChecked = [];

    var mType = unit.type.movetype;
    var player = unit.owner;
    var range = unit.type.range;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) range = unit.fuel;

    // add start tile to the map
    selection.setCenter(x, y, cwt.INACTIVE);
    selection.setValueAt(x, y, range);

    // fill map ( one structure is X;Y;LEFT_POINTS )
    toBeChecked[0] = x;
    toBeChecked[1] = y;
    toBeChecked[2] = range;

    var checker = [-1, -1, -1, -1, -1, -1, -1, -1];

    while (true) {
      var cHigh = -1;
      var cHighIndex = -1;

      for (var i = 0, e = toBeChecked.length; i < e; i += 3) {
        var leftPoints = toBeChecked[i + 2];

        if (leftPoints !== undefined && leftPoints !== null) {
          if (cHigh === -1 || leftPoints > cHigh) {
            cHigh = leftPoints;
            cHighIndex = i;
          }
        }
      }
      if (cHighIndex === -1) break;

      var cx = toBeChecked[cHighIndex];
      var cy = toBeChecked[cHighIndex + 1];
      var cp = toBeChecked[cHighIndex + 2];

      // clear
      toBeChecked[cHighIndex] = null;
      toBeChecked[cHighIndex + 1] = null;
      toBeChecked[cHighIndex + 2] = null;

      // set neighbors for check
      if (cx > 0) {
        checker[0] = cx - 1;
        checker[1] = cy;
      } else {
        checker[0] = -1;
        checker[1] = -1;
      }
      if (cx < cwt.Map.width - 1) {
        checker[2] = cx + 1;
        checker[3] = cy;
      } else {
        checker[2] = -1;
        checker[3] = -1;
      }
      if (cy > 0) {
        checker[4] = cx;
        checker[5] = cy - 1;
      } else {
        checker[4] = -1;
        checker[5] = -1;
      }
      if (cy < cwt.Map.height - 1) {
        checker[6] = cx;
        checker[7] = cy + 1;
      } else {
        checker[6] = -1;
        checker[7] = -1;
      }

      // check the given neighbors for move
      for (var n = 0; n < 8; n += 2) {
        if (checker[n] === -1) continue;

        var tx = checker[n];
        var ty = checker[n + 1];

        cost = this.getMoveCosts(mType, tx, ty);
        if (cost !== -1) {

          var ctile = map[tx][ty];
          var cunit = ctile.unit;
          if (cunit !== null && ctile.visionTurnOwner > 0 && !cunit.hidden && cunit.owner.team !== player.team) {
            continue;
          }

          var rest = cp - cost;
          if (rest >= 0 && rest > selection.getValueAt(tx, ty)) {

            // add possible move to the `selection` map
            selection.setValueAt(tx, ty, rest);

            // add this tile to the checker
            for (var i = 0, e = toBeChecked.length; i <= e; i += 3) {
              if (toBeChecked[i] === null || i === e) {
                toBeChecked[i] = tx;
                toBeChecked[i + 1] = ty;
                toBeChecked[i + 2] = rest;
                break;
              }
            }
          }
        }
      }
    }

    // release helper if you grabbed it
    if (releaseHelper) {
      for (var hi = 0, he = toBeChecked.length; hi < he; hi++) {
        toBeChecked[hi] = null;
      }
      this.fillMoveMapHelper_ = toBeChecked;
    }

    // convert left points back to absolute costs
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {
        if (selection.getValueAt(x, y) !== cwt.INACTIVE) {
          cost = this.getMoveCosts(mType, x, y);
          selection.setValueAt(x, y, cost);
        }
      }

    }
  },

  /**
   *
   * @param {cwt.Array} movePath
   * @param {cwt.Position} source
   * @param {cwt.Position} target
   * @return {boolean}
   */
  trapCheck: function (movePath, source, target) {
    var cBx;
    var cBy;
    var map = cwt.Map.data;
    var cx = source.x;
    var cy = source.y;
    var teamId = source.unit.owner.team;
    for (var i = 0, e = movePath.length; i < e; i++) {

      // break out when the end of the path is reached
      if (movePath.data[i] === cwt.INACTIVE) {
        break;
      }

      switch (movePath.data[i]) {
        case this.MOVE_CODES_DOWN:
          cy++;
          break;
        case this.MOVE_CODES_UP:
          cy--;
          break;
        case this.MOVE_CODES_LEFT:
          cx--;
          break;
        case this.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      var unit = map[cx][cy].unit;
      if (!unit) {

        // no unit there? then it's a valid position
        cBx = cx;
        cBy = cy;

      } else if (teamId !== unit.owner.team) {
        if (DEBUG) assert(typeof cBx !== "number" && typeof cBy !== "number");

        target.set(cBx, cBy); // ? this looks ugly here...
        movePath.data[i] = cwt.INACTIVE;

        return true;
      }
    }

    return false;
  },

  /**
   *
   */
  movePathCache: new cwt.Array(this.MAX_LENGTH, cwt.INACTIVE),

  /**
   *
   * @param unit
   * @param x
   * @param y
   * @param movePath
   * @param {boolean=} noFuelConsumption
   * @param {boolean=} preventRemoveOldPos
   * @param {boolean=} preventSetNewPos
   */
  move: function (unit, x, y, movePath, noFuelConsumption, preventRemoveOldPos, preventSetNewPos) {
    var map = cwt.Map.data;
    var team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    var cX = x;
    var cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos !== true) {
      cwt.Map.data[x][y].unit = null;
    }

    var uType = unit.type;
    var mType = uType.movetype;
    var lastIndex = movePath.length - 1;
    var fuelUsed = 0;

    // check move way by iterate through all move codes and build the path
    //
    // 1. check the correctness of the given move code
    // 2. check all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //

    var trapped = false;
    var lastX = -1;
    var lastY = -1;
    var lastFuel = 0;
    var lastIndex = 0;
    for (var i = 0, e = movePath.getLastIndex(); i < e; i++) {

      // set current position by current move code
      switch (movePath.data[i]) {

        case this.MOVE_CODES_UP:
          if (DEBUG) assert(cY === 0);
          cY--;
          break;

        case this.MOVE_CODES_RIGHT:
          if (DEBUG) assert(cX === cwt.Map.width - 1);
          cX++;
          break;

        case this.MOVE_CODES_DOWN:
          if (DEBUG) assert(cY === cwt.Map.height - 1);
          cY++;
          break;

        case this.MOVE_CODES_LEFT:
          if (DEBUG) assert(cX === 0);
          cX--;
          break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
      if (noFuelConsumption !== true) {
        fuelUsed += this.getMoveCosts(mType, cX, cY);
      }

      var tileUnit = map[cX][cY].unit;

      // movable when tile is empty or the last tile in the way while
      // the unit on the tile belongs to the movers owner
      if (!tileUnit || (tileUnit.owner === unit.owner && i === e-1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

      // enemy unit
      } else if(tileUnit.owner.team !== team) {
        movePath.clear(lastIndex+1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (noFuelConsumption !== true) {
      unit.fuel -= lastFuel;
      if (DEBUG) assert(unit.fuel >= 0);
    }

    // sometimes we prevent to set the unit at the target position because it moves
    // into a thing at a target position (like a transporter)
    if (preventSetNewPos !== true) {
      cwt.Map.data[lastX][lastY].unit = unit;
    }

    cwt.ClientEvents.unitMoves(x, y, lastX, lastY, movePath, trapped);
  }
};
