package net.wolfTec.model;

import net.wolfTec.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class MovePath {

	private Array<MoveCode> path;

	/**
	 * Little helper array object for `model.move_fillMoveMap`. This will be used
	 * only by one process. If the helper is not available then a temp object will
	 * be created in `model.move_fillMoveMap`. If the engine is used without
	 * client hacking then this situation never happen and the
	 * `model.move_fillMoveMap` will use this helper to prevent unnecessary array
	 * creation.
	 */
	private Array<Integer> helper;

	private Array<Integer> checkHelper;

	public MovePath() {
		path = JSCollections.$array();
		helper = JSCollections.$array();

		checkHelper = JSCollections.$array(
				Constants.INACTIVE_ID, 
				Constants.INACTIVE_ID, 
				Constants.INACTIVE_ID, 
				Constants.INACTIVE_ID, 
				Constants.INACTIVE_ID,
				Constants.INACTIVE_ID,
				Constants.INACTIVE_ID,
		    Constants.INACTIVE_ID
		);
	}

	public boolean willBeTrapped() {
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
	 */
	public void generatePath(int stx, int sty, int tx, int ty, Object selection) {
		MoveCode dir;
		var cNode;
		var dsx = stx - selection.getCenterX();
		var dsy = sty - selection.getCenterY();
		var dtx = tx - selection.getCenterX();
		var dty = ty - selection.getCenterY();
		var cx = stx;
		var cy = sty;

		// generate path by the a-star library
		var dataGrid = astar.createDataGrid(selection.getData());
		var start = dataGrid.nodes[dsx][dsy];
		var end = dataGrid.nodes[dtx][dty];
		var path = astar.search(dataGrid, start, end);

		// extract data from generated path map and fill the movePath object
		movePath.clear();
		for (var i = 0, e = path.length; i < e; i++) {
			cNode = path[i];

			// add code to move path
			movePath.push(exports.codeFromAtoB(cx, cy, cNode.x, cNode.y));

			// update current position
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
	 * @return
	 */
	public boolean isGoBackCommand (MoveCode code) {
    var lastCode = movePath.get(movePath.size - 1);
    var goBackCode;

    // get go back code
    switch (code) {
        case exports.MOVE_CODES_UP:
            goBackCode = exports.MOVE_CODES_DOWN;
            break;
        case exports.MOVE_CODES_DOWN:
            goBackCode = exports.MOVE_CODES_UP;
            break;
        case exports.MOVE_CODES_LEFT:
            goBackCode = exports.MOVE_CODES_RIGHT;
            break;
        case exports.MOVE_CODES_RIGHT:
            goBackCode = exports.MOVE_CODES_LEFT;
            break;
    }

    return (lastCode === goBackCode);
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
	public void addCode(MoveCode code, Object selection, int sx, int sy) {
		// drop last move code when the new command realizes a move back schema
		if (movePath.size > 0 && isGoBackCommand(code, movePath)) {
			movePath.popLast();
			return true;
		}

		var source = model.mapData[sx][sy];
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

			case exports.MOVE_CODES_UP:
			case exports.MOVE_CODES_LEFT:
				cy--;
				break;

			case exports.MOVE_CODES_DOWN:
			case exports.MOVE_CODES_RIGHT:
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
	public void fillMoveMap (PositionData source, Object selection, int x, int y, Unit unit) {
    // TODO: source and x,y,unit is kinda double definition of the same things
    var cost;
    var checker;
    var map = model.mapData;

    // grab object data from **source** position if no explicit position and unit data is given
    if (typeof x !== "number") x = source.x;
    if (typeof y !== "number") y = source.y;
    if (!unit) unit = source.unit;

    if (constants.DEBUG) assert(model.isValidPosition(x, y));

    var toBeChecked;
    var releaseHelper = false;
    if (fillMoveMapHelper !== null) {

        // use the cached array
        toBeChecked = fillMoveMapHelper;
        checker = checkArray;

        // reset some stuff
        for (var n = 0, ne = toBeChecked.length; n < ne; n++) {
            toBeChecked[n] = constants.INACTIVE;
        }
        for (var n = 0, ne = checker.length; n < ne; n++) {
            checker[n] = constants.INACTIVE;
        }

        // remove cache objects from the move logic object
        fillMoveMapHelper = null;
        checkArray = null;

        releaseHelper = true;

    } else {
        console.warn("cannot use move cache variables");

        // use a new arrays because cache objects aren't available
        toBeChecked = [];
        checker = [
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE,
            constants.INACTIVE
        ];
    }

    var mType = sheets.movetypes.sheets[unit.type.movetype];
    var range = unit.type.range;
    var player = unit.owner;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) {
        range = unit.fuel;
    }

    // add start tile to the map
    selection.setCenter(x, y, constants.INACTIVE);
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

            if (leftPoints !== undefined && leftPoints !== constants.INACTIVE) {
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
        toBeChecked[cHighIndex] = constants.INACTIVE;
        toBeChecked[cHighIndex + 1] = constants.INACTIVE;
        toBeChecked[cHighIndex + 2] = constants.INACTIVE;

        // set neighbors for check_
        if (cx > 0) {
            checker[0] = cx - 1;
            checker[1] = cy;
        } else {
            checker[0] = -1;
            checker[1] = -1;
        }
        if (cx < model.mapWidth - 1) {
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
        if (cy < model.mapHeight - 1) {
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

            cost = exports.getMoveCosts(mType, tx, ty);
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
                        if (toBeChecked[i] === constants.INACTIVE || i === e) {
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
        fillMoveMapHelper = toBeChecked;
        checkArray = checker;
    }

    // convert left points back to absolute costs
    for (var x = 0, xe = model.mapWidth; x < xe; x++) {
        for (var y = 0, ye = model.mapHeight; y < ye; y++) {
            if (selection.getValue(x, y) !== constants.INACTIVE) {
                cost = exports.getMoveCosts(mType, x, y);
                selection.setValue(x, y, cost);
            }
        }
    }
	}

	/**
	 * 
	 * @param source
	 * @param target
	 * @return
	 */
	public boolean trapCheck (PositionData source, PositionData target) {
    var cBx;
    var cBy;
    var map = model.mapData;
    var cx = source.x;
    var cy = source.y;
    var teamId = source.unit.owner.team;
    for (var i = 0, e = movePath.size; i < e; i++) {
        switch (movePath.get(i)) {
            case exports.MOVE_CODES_DOWN:
                cy++;
                break;

            case exports.MOVE_CODES_UP:
                cy--;
                break;

            case exports.MOVE_CODES_LEFT:
                cx--;
                break;

            case exports.MOVE_CODES_RIGHT:
                cx++;
                break;
        }

        var unit = map[cx][cy].unit;
        if (!unit) {

            // no unit there? then it's a valid position
            cBx = cx;
            cBy = cy;

        } else if (teamId !== unit.owner.team) {
            if (constants.DEBUG) assert(typeof cBx !== "number" && typeof cBy !== "number");

            target.set(cBx, cBy); // ? this looks ugly here...
            movePath.data[i] = constants.INACTIVE;

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
	 * @param noFuelConsumption
	 * @param preventRemoveOldPos
	 * @param preventSetNewPos
	 */
	public void move (Unit unit, int x, int y, boolean noFuelConsumption, boolean preventRemoveOldPos, boolean preventSetNewPos) {
    var map = model.mapData;
    var team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    var cX = x;
    var cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos != true) {
        fog.removeUnitVision(x, y, unit.owner);

        model.mapData[x][y].unit = null;

        if (constants.DEBUG) console.log("remove unit from position ("+x+","+y+")");
    }

    var uType = unit.type;
    var mType = sheets.movetypes.sheets[uType.movetype];
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
    for (var i = 0, e = movePath.size; i < e; i++) {

        // set current position by current move code
        switch (movePath.data[i]) {

            case exports.MOVE_CODES_UP:
                if (constants.DEBUG) assert(cY > 0);
                cY--;
                break;

            case exports.MOVE_CODES_RIGHT:
                if (constants.DEBUG) assert(cX < model.mapWidth - 1);
                cX++;
                break;

            case exports.MOVE_CODES_DOWN:
                if (constants.DEBUG) assert(cY < model.mapHeight - 1);
                cY++;
                break;

            case exports.MOVE_CODES_LEFT:
                if (constants.DEBUG) assert(cX > 0);
                cX--;
                break;
        }

        // calculate the used fuel to move onto the current tile
        // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
        if (noFuelConsumption !== true) {
            fuelUsed += exports.getMoveCosts(mType, cX, cY);
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
        if (constants.DEBUG) assert(unit.fuel >= 0);
    }

    // sometimes we prevent to set the unit at the target position because it moves
    // into a thing at a target position (like a transporter)
    if (preventSetNewPos !== true) {
        model.mapData[lastX][lastY].unit = unit;
        fog.addUnitVision(lastX, lastY, unit.owner);

        if (constants.DEBUG) console.log("set unit to position ("+lastX+","+lastY+")");
    }
	}
}
