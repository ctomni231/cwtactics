//
// Module to control and use the move mechanics.
//
cwt.Move = {

  // Symbolizes a move up.
  //
  MOVE_CODES_UP: 0,

  // Symbolizes a move right.
  //
  MOVE_CODES_RIGHT: 1,

  // Symbolizes a move down.
  //
  MOVE_CODES_DOWN: 2,

  // Symbolizes a move left.
  //
  MOVE_CODES_LEFT: 3,

  // Extracts the move code between two positions.
  //
  codeFromAtoB: function (sx, sy, tx, ty) {
    if (cwt.DEBUG) {
      cwt.assert(cwt.Model.isValidPosition(sx, sy));
      cwt.assert(cwt.Model.isValidPosition(tx, ty));
      cwt.assert(cwt.Model.getDistance(sx, sy, tx, ty) === 1);
    }

    var code = cwt.INACTIVE;
    if (sx < tx) {
      code = this.MOVE_CODES_RIGHT;
    } else if (sx > tx) {
      code = this.MOVE_CODES_LEFT;
    } else if (sy < ty) {
      code = this.MOVE_CODES_DOWN;
    } else if (sy > ty) {
      code = this.MOVE_CODES_UP;
    }

    cwt.assert(code != cwt.INACTIVE);
    return code;
  },

  // Returns the move cost to move with a given move type on a given tile type.
  //
  getMoveCosts: function (movetype, x, y) {
    if (this.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

    var v;
    var tile = cwt.Model.mapData[x][y];

    // grab costs from property or  if not given from tile
    tile = (tile.property) ? tile.property : tile;
    if (tile.type.blocker) {
      v = -1;
    } else {
      v = movetype.costs[tile.type.ID];
    }

    if (typeof v === "number") return v;

    // check_ wildcard
    v = movetype.costs["*"];
    if (typeof v === "number") return v;

    // no match then return `-1`as not move able
    return cwt.INACTIVE;
  },

  //
  // Returns **true** if a **moveType** can move to a position (**x**,**y**), else **false**.
  //
  canTypeMoveTo: function (moveType, x, y) {
    if (this.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

    // check technical movement to tile type
    if (this.getMoveCosts(moveType, x, y) === cwt.INACTIVE) {
      return false;
    }

    // check some other rules like fog and units
    var tile = cwt.Model.mapData[x][y];
    return (tile.visionTurnOwner === 0 || !tile.unit );
  },

  //
  // Generates a path from a start position (**stx**,**sty**) to (**tx**,**ty**) with a given **selection** map. The
  // result path will be stored in the **movePath**.
  //
  generateMovePath: function (stx, sty, tx, ty, selection, movePath) {
    if (cwt.DEBUG) {
      cwt.assert(cwt.Model.isValidPosition(stx, sty));
      cwt.assert(cwt.Model.isValidPosition(tx, ty));
    }

    var dir;
    var cNode;
    var dsx = stx - selection.getCenterX();
    var dsy = sty - selection.getCenterY();
    var dtx = tx - selection.getCenterX();
    var dty = ty - selection.getCenterY();
    var cx = stx;
    var cy = sty;

    // generate path by the astar library
    var graph = new Graph(selection.getData());
    var start = graph.nodes[dsx][dsy];
    var end = graph.nodes[dtx][dty];
    var path = astar.search(graph.nodes, start, end);

    // extract data from generated path map and fill the movePath object
    movePath.clear();
    for (var i = 0, e = path.length; i < e; i++) {
      cNode = path[i];

      // add code to move path
      movePath.push(this.codeFromAtoB(cx, cy, cNode.x, cNode.y));

      // update current position
      cx = cNode.x;
      cy = cNode.y;
    }
  },

  //
  // Compares a given move **code** with a **movePath**. When the new code is the exact opposite direction of the
  // last command in the path then **true** will be return else **false**.
  //
  isGoBackCommand_: function (code, movePath) {
    var lastCode = movePath.get(movePath.size - 1);
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

    return (lastCode === goBackCode);
  },

  //
  // Appends a move `code` to a given `movePath` and returns `true` if the
  // insertion was possible else `false`. If the new code is a backwards move
  // to the previous tile in the path then the actual last tile will be
  // dropped. In this function returns also `true` in this case.
  //
  addCodeToMovePath: function (code, movePath, selection, sx, sy) {
    if (this.DEBUG) cwt.assert(code >= this.MOVE_CODES_UP && code <= this.MOVE_CODES_LEFT);

    // drop last move code when the new command realizes a move back schema
    if (this.isGoBackCommand_(code, movePath)) {
      movePath.popLast();
      return true;
    }

    var source = cwt.Model.mapData[sx][sy];
    var unit = source.unit;
    var points = unit.type.range;
    var fuelLeft = unit.fuel;

    // decrease move range when not enough fuel is available to
    // move the maximum possible range for the selected move type
    if (fuelLeft < points) {
      points = fuelLeft;
    }

    // add command to the move path list
    movePath.push(code);

    // calculate fuel consumption for the current move path
    var cx = sx;
    var cy = sy;
    var fuelUsed = 0;
    for (var i = 0, e = movePath.size; i < e; i++) {
      switch (movePath.get(i)) {

        case this.MOVE_CODES_UP:
        case this.MOVE_CODES_LEFT:
          cy--;
          break;

        case this.MOVE_CODES_DOWN:
        case this.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      // **add fuel consumption to total consumption here**
      fuelUsed += selection.getValue(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      movePath.pop();
      return false;
    } else {
      return true;
    }
  },

  //
  // Little helper array object for `model.move_fillMoveMap`. This will be used only by one process. If the helper is
  // not available then a temp object will be created in `model.move_fillMoveMap`. If the engine is used without client
  // hacking then this situation never happen and the `model.move_fillMoveMap` will use this helper to prevent
  // unnecessary array creation.
  //
  // @private
  //
  fillMoveMapHelper_: [],

  //
  // @private
  //
  checker_: [
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE
  ],

  //
  // Fills a **selection** map for move able tiles. If no explicit start position (**x**,**y**) and moving **unit**
  // is given, then the **source** position object will be used to extract data.
  //
  fillMoveMap: function (source, selection, x, y, unit) {
    // TODO: source and x,y,unit is kinda double definition of the same things
    var cost;
    var checker;
    var map = cwt.Model.mapData;

    // grab object data from **source** position if no explicit position and unit data is given
    if (typeof x !== "number") x = source.x;
    if (typeof y !== "number") y = source.y;
    if (!unit) unit = source.unit;

    if (this.DEBUG) cwt.assert(cwt.Model.isValidPosition(x, y));

    var toBeChecked;
    var releaseHelper = false;
    if (this.fillMoveMapHelper_ !== null) {

      // use the cached array
      toBeChecked = this.fillMoveMapHelper_;
      checker = this.checker_;

      // reset some stuff
      for (var n = 0, ne = toBeChecked.length; n < ne; n++) {
        toBeChecked[n] = null;
      }
      for (var n = 0, ne = checker.length; n < ne; n++) {
        checker[n] = cwt.INACTIVE;
      }

      // remove cache objects from the move logic object
      this.fillMoveMapHelper_ = null;
      this.checker_ = null;

      releaseHelper = true;

    } else {

      // use a new arrays because cache objects aren't available
      toBeChecked = [];
      checker = [
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE
      ];
    }

    var mType = unit.type.movetype;
    var range = unit.type.range;
    var player = unit.owner;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) {
      range = unit.fuel;
    }

    // add start tile to the map
    selection.setCenter(x, y, cwt.INACTIVE);
    selection.setValue(x, y, range);

    // fill map ( one structure is X;Y;LEFT_POINTS )
    toBeChecked[0] = x;
    toBeChecked[1] = y;
    toBeChecked[2] = range;

    while (true) {
      var cHigh = -1;
      var cHighIndex = -1;

      for (var i = 0, e = toBeChecked.length; i < e; i += 3) {
        var leftPoints = toBeChecked[i + 2];

        if (leftPoints !== undefined && leftPoints !== cwt.INACTIVE) {
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
      toBeChecked[cHighIndex] = cwt.INACTIVE;
      toBeChecked[cHighIndex + 1] = cwt.INACTIVE;
      toBeChecked[cHighIndex + 2] = cwt.INACTIVE;

      // set neighbors for check_
      if (cx > 0) {
        checker[0] = cx - 1;
        checker[1] = cy;
      } else {
        checker[0] = -1;
        checker[1] = -1;
      }
      if (cx < cwt.Model.mapWidth - 1) {
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
      if (cy < cwt.Model.mapHeight - 1) {
        checker[6] = cx;
        checker[7] = cy + 1;
      } else {
        checker[6] = -1;
        checker[7] = -1;
      }

      // check_ the given neighbors for move
      for (var n = 0; n < 8; n += 2) {
        if (checker[n] === -1) {
          continue;
        }

        var tx = checker[n];
        var ty = checker[n + 1];

        cost = this.getMoveCosts(mType, tx, ty);
        if (cost !== -1) {

          var cTile = map[tx][ty];
          var cUnit = cTile.unit;

          if (cUnit !== null && cTile.visionTurnOwner > 0 && !cUnit.hidden && cUnit.owner.team !== player.team) {
            continue;
          }

          var rest = cp - cost;
          if (rest >= 0 && rest > selection.getValue(tx, ty)) {

            // add possible move to the `selection` map
            selection.setValue(tx, ty, rest);

            // add this tile to the checker
            for (var i = 0, e = toBeChecked.length; i <= e; i += 3) {
              if (toBeChecked[i] === cwt.INACTIVE || i === e) {
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
      this.fillMoveMapHelper_ = toBeChecked;
      this.checker_ = checker;
    }

    // convert left points back to absolute costs
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {
        if (selection.getValue(x, y) !== cwt.INACTIVE) {
          cost = this.getMoveCosts(mType, x, y);
          selection.setValue(x, y, cost);
        }
      }
    }
  },

  //
  //
  // @param {cwt.CircularBuffer} movePath
  // @param {cwt.Position} source
  // @param {cwt.Position} target
  // @return {boolean}
  //
  trapCheck: function (movePath, source, target) {
    var cBx;
    var cBy;
    var map = cwt.Model.mapData;
    var cx = source.x;
    var cy = source.y;
    var teamId = source.unit.owner.team;
    for (var i = 0, e = movePath.size; i < e; i++) {
      switch (movePath.get(i)) {
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
        if (this.DEBUG) cwt.assert(typeof cBx !== "number" && typeof cBy !== "number");

        target.set(cBx, cBy); // ? this looks ugly here...
        movePath.data[i] = cwt.INACTIVE;

        return true;
      }
    }

    return false;
  },

  //
  //
  //
  movePathCache: new cwt.CircularBuffer(cwt.MAX_MOVE_LENGTH),

  //
  //
  // @param unit
  // @param x
  // @param y
  // @param movePath
  // @param {boolean=} noFuelConsumption
  // @param {boolean=} preventRemoveOldPos
  // @param {boolean=} preventSetNewPos
  //
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

    // check_ move way by iterate through all move codes and build the path
    //
    // 1. check_ the correctness of the given move code
    // 2. check_ all tiles to recognize trapped moves
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
          if (this.DEBUG) cwt.assert(cY === 0);
          cY--;
          break;

        case this.MOVE_CODES_RIGHT:
          if (this.DEBUG) cwt.assert(cX === cwt.Map.width - 1);
          cX++;
          break;

        case this.MOVE_CODES_DOWN:
          if (this.DEBUG) cwt.assert(cY === cwt.Map.height - 1);
          cY++;
          break;

        case this.MOVE_CODES_LEFT:
          if (this.DEBUG) cwt.assert(cX === 0);
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
      if (!tileUnit || (tileUnit.owner === unit.owner && i === e - 1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

        // enemy unit
      } else if (tileUnit.owner.team !== team) {
        movePath.clear(lastIndex + 1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (noFuelConsumption !== true) {
      unit.fuel -= lastFuel;
      if (this.DEBUG) cwt.assert(unit.fuel >= 0);
    }

    // sometimes we prevent to set the unit at the target position because it moves
    // into a thing at a target position (like a transporter)
    if (preventSetNewPos !== true) {
      cwt.Map.data[lastX][lastY].unit = unit;
    }

    cwt.ClientEvents.unitMoves(x, y, lastX, lastY, movePath, trapped);
  }
};
