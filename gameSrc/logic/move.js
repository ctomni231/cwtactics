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
   *
   */
  movePathCache: new cwt.List(this.MAX_LENGTH, INACTIVE_ID),

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

    return INACTIVE_ID;
  },


  /**
   * Returns the movecosts to move with a given move type on a
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

  /**
   * Appends a move `code` to a given `movePath` and returns `true` if the
   * insertion was possible else `false`. If the new code is a backwards move
   * to the previous tile in the path then the actual last tile will be
   * dropped. In this function returns also `true` in this case.
   */
  addCodeToMovePath: function (code, movePath) {
    if (DEBUG) assert(code >= this.MOVE_CODES_UP && code <= this.MOVE_CODES_LEFT);

    // is the move a go back to the last tile ?
    var lastCode = movePath.getLastCode();
    var goBackCode;
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
      movePath[movePath.getSize() - 1] = INACTIVE_ID;
      return true;
    }

    var source = controller.stateMachine.data.source;
    var unit = source.unit;
    var fuelLeft = unit.fuel;
    var fuelUsed = 0;
    var points = unit.type.range;
    if (fuelLeft < points) points = fuelLeft;

    // add command to the move path list
    movePath[movePath.getSize()] = code;

    // calculate fuel consumption for the current move path
    var cx = source.x;
    var cy = source.y;
    for (var i = 0, e = movePath.getSize(); i < e; i++) {
      switch (movePath[i]) {

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
      fuelUsed += controller.stateMachine.data.selection.getValueAt(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      movePath[movePath.getSize() - 1] = INACTIVE_ID; // remove the code that you placed before
      return false;
    } else return true;
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
   */
  fillMoveMap: function (source, selection, x, y, unit) {
    var cost;

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
    selection.setCenter(x, y, INACTIVE_ID);
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

        cost = model.move_getMoveCosts(mType, tx, ty);
        if (cost !== -1) {

          var cunit = model.unit_posData[tx][ty];
          if (cunit !== null && model.fog_turnOwnerData[tx][ty] > 0 && !cunit.hidden && model.player_data[cunit.owner].team !== player.team) {
            continue;
          }

          // scripted movecosts
          cost = controller.scriptedValue(unit.owner, "movecost", cost);

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
        if (selection.getValueAt(x, y) !== INACTIVE_ID) {
          cost = this.getMoveCosts(mType, x, y);
          selection.setValueAt(x, y, cost);
        }
      }

    }
  },

  /**
   *
   */
  trapCheck: function (way, source, target) {
    var cBx;
    var cBy;
    var cx = source.x;
    var cy = source.y;
    var sourceTeamId = model.player_data[source.unit.owner].team;
    for (var i = 0, e = way.length; i < e; i++) {

      // end of way
      if (way[i] === -1) break;

      switch (way[i]) {

        case model.move_MOVE_CODES.DOWN:
          cy++;
          break;

        case model.move_MOVE_CODES.UP:
          cy--;
          break;

        case model.move_MOVE_CODES.LEFT:
          cx--;
          break;

        case model.move_MOVE_CODES.RIGHT:
          cx++;
          break;
      }

      var unit = model.unit_posData[cx][cy];

      // position is valid when no unit is there
      if (!unit) {
        cBx = cx;
        cBy = cy;

      } else if (sourceTeamId !== model.player_data[unit.owner].team) {

        target.set(cBx, cBy);
        way[i] = INACTIVE_ID;
        return true;
      }
    }

    return false;
  },

  move: function (uid, x, y, noFuelConsumption) {
    var way = model.move_pathCache;
    var cX = x;
    var cY = y;
    var unit = model.unit_data[ uid ];
    var uType = unit.type;
    var mType = model.data_movetypeSheets[ uType.movetype ];
    var wayIsIllegal = false;
    var lastIndex = way.length - 1;
    var fuelUsed = 0;

    // check move way by iterate through all move codes and build the path
    //
    // 1. check the correctness of the given move code
    // 2. check all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //
    for (var i = 0, e = way.length; i < e; i++) {
      if (way[i] === INACTIVE_ID) break;

      // set current position by current move code
      switch (way[i]) {

        case this.MOVE_CODES_UP:
          if (cY === 0) wayIsIllegal = true;
          cY--;
          break;

        case this.MOVE_CODES_RIGHT:
          if (cX === cwt.Map.width - 1) wayIsIllegal = true;
          cX++;
          break;

        case this.MOVE_CODES_DOWN:
          if (cY === cwt.Map.height - 1) wayIsIllegal = true;
          cY++;
          break;

        case this.MOVE_CODES_LEFT:
          if (cX === 0) wayIsIllegal = true;
          cX--;
          break;
      }

      // when the way contains an illegal value that isn't part of
      // `model.move_MOVE_CODES` then break the move process.
      assert(!wayIsIllegal);

      // is way blocked ? (niy!)
      if (false /* && model.isWayBlocked( cX, cY, unit.owner, (i === e - 1) ) */ ) {
        lastIndex = i - 1;

        // go back until you find a valid tile
        switch (way[i]) {
          case this.MOVE_CODES_UP:
            cY++;
            break;
          case this.MOVE_CODES_RIGHT:
            cX--;
            break;
          case this.MOVE_CODES_DOWN:
            cY--;
            break;
          case this.MOVE_CODES_LEFT:
            cX++;
            break;
        }

        // this is normally not possible, except other modules makes a fault in this case
        // the moving system could not recognize a enemy in front of the mover that causes a `trap`
        assert(lastIndex !== -1);

        break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
      if (noFuelConsumption !== true) fuelUsed += this.getMoveCosts(mType, cX, cY);
    }

    // consume fuel ( if `noFuelConsumption` is `true` then the costs will be `0` )
    unit.fuel -= fuelUsed;
    assert(unit.fuel >= 0);

    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN) SOMEWHERE
    if (unit.x >= 0 && unit.y >= 0) {

      model.events.clearUnitPosition(uid);
    }

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (model.unit_posData[cX][cY] === null) model.events.setUnitPosition(uid, cX, cY);
  }
};