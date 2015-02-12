"use strict";

var constants = require("./constants");
var relation = require("./relationship");
var renderer = require("./renderer");
var actions = require("./actions");
var sheets = require("./sheets");
var model = require("./model");
var debug = require("./debug");
var util = require("./utility");









exports.actionUnload = {
    multiStepAction: true,

    relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],

    condition: function (transporter, x, y) {
        return (
        transport.isTransportUnit(transporter) &&
        transport.canUnloadSomethingAt(transporter, x, y)
        );
    },

    prepareMenu: function (transporter, x, y, menu) {
        var i, e;
        for (i = 0, e = model.units.length; i < e; i++) {
            if (model.getUnit(i).loadedIn === transporter) {
                menu.addEntry(i.toString(), true);
            }
        }
    },

    targetSelectionType: "B",
    prepareTargets: function (transporter, x, y, load, selection) {
        var loadMovetype = sheets.getSheet(sheets.TYPE_MOVETYPE, load.type.movetype);

        // check west
        if (transport.canUnloadSomethingAt(transporter, x - 1, y) && move.canTypeMoveTo(loadMovetype, x - 1, y) ) {
            selection.setValue(x - 1, y, 1);
        }

        // check east
        if (transport.canUnloadSomethingAt(transporter, x + 1, y) && move.canTypeMoveTo(loadMovetype, x + 1, y)) {
            selection.setValue(x + 1, y, 1);
        }

        // check south
        if (transport.canUnloadSomethingAt(transporter, x, y + 1) && move.canTypeMoveTo(loadMovetype, x, y + 1)) {
            selection.setValue(x, y + 1, 1);
        }

        // check north
        if (transport.canUnloadSomethingAt(transporter, x, y - 1) && move.canTypeMoveTo(loadMovetype, x, y - 1)) {
            selection.setValue(x, y - 1, 1);
        }
    },

    invoke: function (transporterId, loadId, tx, ty, moveCode) {
        var load = model.getUnit(loadId);
        var transporter = model.getUnit(transporterId);

        transport.unload(transporter, load);

        // add commands in reverse order
        actions.localActionLIFO("wait", transporterId);
        actions.localActionLIFO("moveEnd", false, true);
        actions.localActionLIFO("moveAppend", moveCode);
        actions.localActionLIFO("moveStart", loadId, tx, ty);
    }
};

exports.actionLoad = {
    relation: ["S", "T", relation.RELATION_OWN],

    positionUpdateMode: actions.PREVENT_SET_NEW_POS,

    condition: function (transporter, load) {
        return (
        transport.isTransportUnit(transporter) &&
        transport.canLoadUnit(transporter, load));
    },

    invoke: function (transporterId, loadId) {
        transport.loadGameConfig(
            model.getUnit(transporterId),
            model.getUnit(loadId));
    }
};

// --------------------------------------------------------------------------------------------------------


              //  Debug.logInfo(null, "Send unit " + actionData.p1 + " into wait status");
                //  CustomWarsTactics.gameround.units.$get(actionData.p1).setActable(false);
                //renderer.renderUnitsOnScreen();

/**
 *
 * @param player
 * @param menu
 */
exports.getPropertyTransferTargets = function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
        if (i === origI) continue;

        var player = model.players[i];
        if (!player.isInactive()) {
            menu.addEntry(i, true);
        }
    }
};

/**
 *
 * @param player
 * @param menu
 */
default void getUnitTransferTargets = function (player, menu) {
    if (constants.DEBUG) assert(player instanceof model.Player);

    var origI = player.ID;
    for (var i = 0, e = constants.MAX_PLAYER; i < e; i++) {
        if (i === origI) continue;

        var player = model.getPlayer(i);
        if (!player.isInactive() && player.numberOfUnits < constants.MAX_UNITS) {
            menu.addEntry(i, true);
        }
    }
};
exports.actionMoney = {
    condition: function (player, x, y) {
        return team.canTransferMoney(player, x, y);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getTransferMoneyTargets(player, menu);
    },

    invoke: function (sourcePlayerId, targetPlayerId, money) {
        team.transferMoney(model.getPlayer(sourcePlayerId), model.getPlayer(targetPlayerId), money);
    }
};

exports.actionProperty = {
    relationToProp: ["S", "T", relation.RELATION_SAME_THING],

    condition: function (property) {
        return team.canTransferProperty(property);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getPropertyTransferTargets(player, menu);
    },

    invoke: function (propertyId, targetPlayerId) {
        team.transferPropertyToPlayer(model.getProperty(propertyId), model.getPlayer(targetPlayerId));
    }
};

exports.actionUnit = {
    relation: ["S", "T", relation.RELATION_SAME_THING],

    condition: function (unit) {
        return team.canTransferUnit(unit);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        team.getUnitTransferTargets(player, menu);
    },

    invoke: function (unitId, targetPlayerId) {
        team.transferUnitToPlayer(model.getUnit(unitId), model.getPlayer(targetPlayerId));
    }
};

require('../actions').unitAction({
    key: "silofire",

    relation: [
        "S", "T",
        cwt.Relationship.RELATION_SAME_THING,
        cwt.Relationship.RELATION_NONE
    ],

    relationToProp: [
        "S", "T",
        cwt.Player.RELATION_NONE
    ],

    condition: function (data) {
        if (!cwt.Silo.isRocketSilo(data.target.property)) return false;
        if (!cwt.Silo.canBeFired(data.target.property, data.source.unit)) return false;
        return true;
    },

    prepareSelection: function (data) {
        data.selectionRange = data.target.property.type.rocketsilo.range;
    },

    isTargetValid: function (data, x, y) {
        return cwt.Silo.canBeFiredTo(data.target.property, x, y);
    },

    toDataBlock: function (data, dataBlock) {
        dataBlock.p1 = data.source.x;
        dataBlock.p2 = data.source.y;
        dataBlock.p3 = data.targetselection.x;
        dataBlock.p4 = data.targetselection.y;
        dataBlock.p5 = data.source.unit.owner.id;
    },

    parseDataBlock: function (dataBlock) {
        cwt.Silo.fireSilo(
            dataBlock.p1,dataBlock.p2,
            dataBlock.p3,dataBlock.p4,
            cwt.Player.getInstance(dataBlock.p5)
        );
    }
});

//
// Returns **true** when a cannon trigger unit is at a given position (**x**,**y**) and has targets in it's range,
// else **false**.
//
exports.hasTargets = function (x, y, selection) {
    return (this.isCannonUnit(cwt.Model.mapData[x][y].unit) && this.markCannonTargets(x, y, selection));
};

//
//
// @param {number} x
// @param {number} y
// @param {cwt.SelectionMap} selection
//
exports.fillCannonTargets = function (x, y, selection) {
    this.markCannonTargets(x, y, selection);
};

//
// Fires a cannon at a given position.
//
exports.fireCannon = function (ox, oy, x, y) {
    var target = cwt.Model.mapData[x][y].unit;
    var type = this.grabBombPropTypeFromPos(ox, oy);

    target.takeDamage(cwt.Unit.pointsToHealth(type.cannon.damage), 9);
};

//
// Marks all cannon targets in a selection. The area of fire will be defined by
// the rectangle from  `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
// with a given `range`.
//
exports.tryToMarkCannonTargets = function (player, selection, ox, oy, otx, oty, sx, sy, tx, ty, range) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.PlayerClass);

    var tid = player.team;
    var osy = sy;
    var result = false;
    for (; sx <= tx; sx++) {
        for (sy = osy; sy >= ty; sy--) {
            if (!cwt.Map.isValidPosition(sx, sy)) continue;
            var tile = cwt.Map.data[sx][sy];

            // range maybe don't match
            if ((Math.abs(sx - ox) + Math.abs(sy - oy)) > range) continue;
            if ((Math.abs(sx - otx) + Math.abs(sy - oty)) > range) continue;

            // in fog
            if (tile.visionTurnOwner <= 0) continue;

            var unit = tile.unit;
            if (unit) {
                if (unit.owner.team !== tid) {
                    if (selection) selection.setValueAt(sx, sy, 1);
                    else return true;
                    result = true;
                }
            }
        }
    }

    return result;
};

//
// Marks all cannon targets in a given selection model.
//
// @param {cwt.Unit} cannon
// @param {cwt.SelectionMap} selection
//
exports.markCannonTargets = function (x, y, selection) {
    var prop = cwt.Model.mapData[x][y].property;
    var type = (prop.type.ID !== "PROP_INV") ? prop.type : this.grabBombPropTypeFromPos(x, y);

    if (this.DEBUG) cwt.assert(type.cannon);

    selection.setCenter(x, y, cwt.INACTIVE);

    var otx, oty, sx, sy, tx, ty;
    var max = type.cannon.range;
    var ox = x;
    var oy = y;
    switch (type.cannon.direction) {

        case "N":
            otx = x;
            oty = y - max - 1;
            sx = x - max + 1;
            sy = y - 1;
            tx = x + max - 1;
            ty = y - max;
            break;

        case "E":
            otx = x + max + 1;
            oty = y;
            sx = x + 1;
            sy = y + max - 1;
            tx = x + max;
            ty = y - max + 1;
            break;

        case "W":
            otx = x - max - 1;
            oty = y;
            sx = x - max;
            sy = y + max - 1;
            tx = x - 1;
            ty = y - max + 1;
            break;

        case "S":
            otx = x;
            oty = y + max + 1;
            sx = x - max + 1;
            sy = y + max;
            tx = x + max - 1;
            ty = y + 1;
            break;
    }

    return this.tryToMarkCannonTargets(
        cwt.Model.mapData[x][y].unit.owner,
        selection,
        ox, oy,
        otx, oty,
        sx, sy,
        tx, ty,
        max
    );
};

//
//
// @param x
// @param y
// @return {cwt.PropertySheet}
//
exports.grabBombPropTypeFromPos = function (x, y) {
    var map = cwt.Model.mapData;
    while (true) {
        if (y + 1 < cwt.Model.mapHeight && map[x][y + 1].property &&
            map[x][y + 1].property.type.ID === cwt.DataSheets.PROP_INV) {
            y++;
            continue;
        }

        break;
    }

    if (map[x][y].property.type.ID !== cwt.DataSheets.PROP_INV) {
        return map[x][y].property.type;
    }

    while (true) {
        if (x + 1 < cwt.Model.mapWidth && map[x + 1][y].property &&
            map[x + 1][y].property.type.ID !== cwt.DataSheets.PROP_INV) {
            return map[x + 1][y].property.type;
        }

        break;
    }

    cwt.assert(false);
};

require('../actions').unitAction({
    key: "fireCannon",

    relation: [
        "S", "T",
        cwt.Relationship.RELATION_SAME_THING
    ],

    condition: function (data) {
        return (
        cwt.Cannon.isCannonUnit(data.source.unit) &&
        cwt.Cannon.hasTargets(data.source.x, data.source.y, null)
        );
    },

    targetSelectionType: "A",
    prepareTargets: function (data) {
        cwt.Cannon.fillCannonTargets(data.source.x, data.source.y, data.selection);
    },

    toDataBlock: function (data, dataBlock) {
        dataBlock.p1 = data.source.x;
        dataBlock.p2 = data.source.y;
        dataBlock.p3 = data.targetselection.x;
        dataBlock.p4 = data.targetselection.y;
    },

    parseDataBlock: function (dataBlock) {
        cwt.Cannon.fireCannon(dataBlock.p1, dataBlock.p2,dataBlock.p3, dataBlock.p4);
    }

});

require('../actions').unitAction({
    key:"fireLaser",

    relation:[
        "S","T",
        cwt.Relationship.RELATION_SAME_THING
    ],

    condition: function( data ){
        return cwt.Laser.isLaser(data.target.unit);
    },

    toDataBlock: function (data, dataBlock) {
        dataBlock.p1 = data.target.x;
        dataBlock.p2 = data.target.y;
    },

    parseDataBlock: function (dataBlock) {
        cwt.Laser.fireLaser(dataBlock.p1,dataBlock.p2);
    }
});

// --------------------------------------------------------------------------------------------------------



exports.action = {
    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function(unit, x, y) {
        return (supply.isSupplier(unit) && supply.hasRefillTargetsNearby(unit, x, y));
    },

    invoke: function(x, y) {
        assert(model.isValidPosition(x, y));

        var unit = model.mapData[x][y].unit;
        assert(unit && supply.isSupplier(unit));

        if (supply.canRefillObjectAt(unit, x + 1, y)) actions.localAction("refillSupply", x + 1, y);
        if (supply.canRefillObjectAt(unit, x - 1, y)) actions.localAction("refillSupply", x - 1, y);
        if (supply.canRefillObjectAt(unit, x, y + 1)) actions.localAction("refillSupply", x, y + 1);
        if (supply.canRefillObjectAt(unit, x, y - 1)) actions.localAction("refillSupply", x, y - 1);
    }
};

exports.actionRefillSupply = {
    invoke: function(x, y) {
        if (constants.DEBUG) assert(model.mapData[x][y].unit);
        supply.refillSuppliesByPosition(x, y);
    }
};

exports.actionHealUnit = {
    invoke: function(x, y) {
        if (constants.DEBUG) assert(supply.canPropertyRepairAt(x, y));
        supply.propertyRepairsAt(x, y);
    }
};


//
// Constructs a unit with **type** in a **factory** for the owner of the factory. The owner must have at least one
// of his unit slots free to do this.
//
exports.buildUnit = (function () {

    function buildIt(x, y, property, type) {
        // TODO
        lifecycle.createUnit(x, y, property.owner, type);
    }

    return function (factory, type) {
        if (constants.DEBUG) {
            assert(factory instanceof model.Property);
            assert(sheets.units.isValidType(type));
        }

        var sheet = sheets.units.sheets[type];

        factory.owner.manpower--;
        factory.owner.gold -= sheet.cost;

        if (constants.DEBUG) {
            assert(factory.owner.gold >= 0);
            assert(factory.owner.manpower >= 0);
        }

        model.searchProperty(factory, buildIt, null, type);
    };
})();

//
// Generates the build menu for a **factory** and puts the build able unit type ID's into a **menu**. If
// **markDisabled** is enabled then the function will add types that temporary aren't produce able (e.g. due
// lack of money) but marked as disabled.
//
exports.generateBuildMenu = function (factory, menu, markDisabled) {
    if (constants.DEBUG) {
        assert(factory instanceof model.Property);
        assert(factory.owner);
    }

    var unitTypes = sheets.units.types;
    var bList = factory.type.builds;
    var gold = factory.owner.gold;

    for (var i = 0, e = unitTypes.length; i < e; i++) {
        var key = unitTypes[i];
        var type = sheets.units.getSheet(key);

        if (bList.indexOf(type.movetype) === -1) continue;

        // Is the tile blocked ?
        if (type.blocked) return false;

        if (type.cost <= gold || markDisabled) {
            menu.addEntry(key, (type.cost <= gold));
        }
    }
};

exports.action = {
    condition: function (property) {
        return (factory.isFactory(property) && factory.canProduce(property) );
    },

    hasSubMenu: true,
    prepareMenu: function (property, menu) {
        factory.generateBuildMenu(property, menu, true);
    },

    invoke: function (factoryId, type) {
        factory.buildUnit(model.getProperty(factoryId), type);
        renderer.renderUnitsOnScreen();
        fog.fullRecalculation();
    }
};

// --------------------------------------------------------------------------------------------------------


var cfgFogEnabled = require("../config").getConfig("fogEnabled");





/*
 model.event_on("modifyVisionAt", function( x,y, pid, range, value ){
 range = 10; // TAKE THE MAXIMUM RANGE

 var lX;
 var hX;
 var lY = y-range;
 var hY = y+range;
 if( lY < 0 ) lY = 0;
 if( hY >= model.map_height ) hY = model.map_height-1;
 for( ; lY<=hY; lY++ ){

 var disY = Math.abs( lY-y );
 lX = x-range+disY;
 hX = x+range-disY;
 if( lX < 0 ) lX = 0;
 if( hX >= model.map_width ) hX = model.map_width-1;
 for( ; lX<=hX; lX++ ){
 view.redraw_markPos( lX,lY );

 var unit = model.unit_posData[lX][lY];
 if( unit !== null && unit.hidden ){
 controller.updateUnitStatus( model.unit_extractId( unit ) );
 }
 }
 }
 });

 model.event_on("recalculateFogMap",function(range){
 view.redraw_markAll();
 });
 //*/

// --------------------------------------------------------------------------------------------------------




exports.action = {
    noAutoWait: true,

    relation: ["S", "T", relation.RELATION_OWN],

    condition: function (sourceUnit, targetUnit) {
        return join.canJoin(sourceUnit, targetUnit);
    },

    invoke: function (sourceUnitId, x, y) {
        // TODO: better is sx,sy,tx,ty
        join.join(model.getUnit(sourceUnitId), x, y);
    }

};

// --------------------------------------------------------------------------------------------------------

var cfgNoUnitsLeftLoose = require("../config").getConfig("noUnitsLeftLoose");


// --------------------------------------------------------------------------------------------------------


var aStar = window.astar;
var Graph = window.Graph;

var searchPath = function (grid, start, end) {
    aStar.search(grid.nodes, start, end);
};

var createDataGrid = function (data) {
    return new Graph(data);
};

// cached variables
var uid = constants.INACTIVE;
var x = constants.INACTIVE;
var y = constants.INACTIVE;
var moveBuffer = new CircularBuffer(constants.MAX_SELECTION_RANGE);


// Symbolizes a move up.
//
exports.MOVE_CODES_UP = 0;

// Symbolizes a move right.
//
exports.MOVE_CODES_RIGHT = 1;

// Symbolizes a move down.
//
exports.MOVE_CODES_DOWN = 2;

// Symbolizes a move left.
//
exports.MOVE_CODES_LEFT = 3;

// Extracts the move code between two positions.
//
exports.codeFromAtoB = function (sx, sy, tx, ty) {
    if (constants.DEBUG) {
        assert(model.isValidPosition(sx, sy));
        assert(model.isValidPosition(tx, ty));
        assert(model.getDistance(sx, sy, tx, ty) === 1);
    }

    var code = constants.INACTIVE;
    if (sx < tx) {
        code = exports.MOVE_CODES_RIGHT;
    } else if (sx > tx) {
        code = exports.MOVE_CODES_LEFT;
    } else if (sy < ty) {
        code = exports.MOVE_CODES_DOWN;
    } else if (sy > ty) {
        code = exports.MOVE_CODES_UP;
    }

    assert(code != constants.INACTIVE);
    return code;
};

// Returns the move cost to move with a given move type on a given tile type.
//
exports.getMoveCosts = function (movetype, x, y) {
    if (constants.DEBUG) assert(model.isValidPosition(x, y));

    var v;
    var tile = model.mapData[x][y];

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
    return constants.INACTIVE;
};

//
// Returns **true** if a **moveType** can move to a position (**x**,**y**), else **false**.
//
exports.canTypeMoveTo = function (moveType, x, y) {
    if (constants.DEBUG) assert(model.isValidPosition(x, y));

    // check technical movement to tile type
    if (exports.getMoveCosts(moveType, x, y) === constants.INACTIVE) {
        return false;
    }

    // check some other rules like fog and units
    var tile = model.mapData[x][y];
    return (tile.visionTurnOwner === 0 || !tile.unit );
};


exports.actionStart = {
    invoke: function (unitId, unitX, unitY) {
        debug.logInfo("prepare new move way");

        // check that a move command cannot invoked when a move command is already in progress
        if (y !== constants.INACTIVE && x !== constants.INACTIVE && uid !== constants.INACTIVE) {
            throw new Error("IllegalStateException");
        }

        moveBuffer.clear();
        uid = unitId;
        x = unitX;
        y = unitY;
    }
};

exports.actionAppend = {
    invoke: function () {
        var i, e;
        for (i = 0, e = arguments.length; i < e; i++) {
            if (arguments[i] !== constants.INACTIVE) {
                debug.logInfo("append move command " + arguments[i]);
                moveBuffer.push(arguments[i]);
            }
        }
    }
};

exports.actionEnd = {
    invoke: function (preventOldPosUpd, preventNewPosUpd) {
        debug.logInfo("doing move from given move path");

        move.move(model.getUnit(uid), x, y, moveBuffer, false, preventOldPosUpd, preventNewPosUpd);

        statemachine.changeState("ANIMATION_MOVE");
        moveState.prepareMove(uid, x, y, moveBuffer);

        // reset variables
        uid = constants.INACTIVE;
        x = constants.INACTIVE;
        y = constants.INACTIVE;
    }
};

// --------------------------------------------------------------------------------------------------------


var cfgAutoSupply = require("../config").getConfig("autoSupplyAtTurnStart");
var cfgDayLimit = require("../config").getConfig("round_dayLimit");


var statemachine = require("../statemachine");

function checkForRepairTargets(x, y, tile) {

    // check repair via property
    if (tile.unit.hp < 99) actions.localAction("healUnit", x, y);

    // give funds
    exports.raiseFunds(tile.property);
}

function checkForSupplyTargets(x, y, tile) {

    // check neighbours
    if (supply.isSupplier(tile.unit)) {
        if (supply.canRefillObjectAt(tile.unit, x + 1, y)) actions.localAction("refillSupply", x + 1, y);
        if (supply.canRefillObjectAt(tile.unit, x - 1, y)) actions.localAction("refillSupply", x - 1, y);
        if (supply.canRefillObjectAt(tile.unit, x, y + 1)) actions.localAction("refillSupply", x, y + 1);
        if (supply.canRefillObjectAt(tile.unit, x, y - 1)) actions.localAction("refillSupply", x, y - 1);
    }

    // drain fuel
    supply.drainFuel(tile.unit);
}

exports.startsTurn = function(player) {

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled) {
        model.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    var clTid = model.lastClientPlayer.team;
    var i, e;
    for (i = 0, e = constants.MAX_PLAYER; i < e; i++) {
        var cPlayer = model.players[i];

        cPlayer.turnOwnerVisible = false;
        cPlayer.clientVisible = false;

        // player isn't registered
        if (cPlayer.team === constants.INACTIVE) continue;

        if (cPlayer.team === clTid) {
            cPlayer.clientVisible = true;
        }
        if (cPlayer.team === player.team) {
            cPlayer.turnOwnerVisible = true;
        }
    }
};

exports.action = {
    invoke: function(startTurn) {
        assert(arguments.length === 0 || startTurn === 1);

        // special variable for the first turn -> we need the turn start actions after starting the game without
        // changing internal day data
        if (startTurn) {
            exports.startsTurn(model.turnOwner);

        } else {
            var pid = model.turnOwner.id;
            var oid = pid;

            // Try to find next player from the player pool
            pid++;
            while (pid !== oid) {

                if (pid === constants.MAX_PLAYER) {
                    pid = 0;

                    // Next day
                    model.day++;
                    model.weatherLeftDays--;

                    // TODO: into action
                    var round_dayLimit = cfgDayLimit.value;
                    if (round_dayLimit > 0 && model.day >= round_dayLimit) {
                        cwt.Update.endGameRound();
                        // TODO
                    }
                }

                // Found next player
                if (model.players[pid].team !== constants.INACTIVE) break;

                // Try next player
                pid++;
            }

            // If the new player id is the same as the old
            // player id then the game aw2 is corrupted
            if (this.DEBUG) assert(pid !== oid);

            // Do end/start turn logic
            model.turnOwner = model.players[pid];
            exports.startsTurn(model.turnOwner);

            if (network.isHost()) {

                // check for next weather stuff
                if (model.weatherLeftDays === 0) {
                    var nextWeather = weather.pickRandomWeatherId();
                    var nextDuration = weather.pickRandomWeatherTime(nextWeather);

                    actions.sharedAction("changeWeather", nextWeather, nextDuration);
                }

                // TODO: Do AI-Turn
                /*
                 if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
                 controller.ai_machine.event("tick");
                 }
                 */
            }
        }

        // recalc fog
        fog.fullRecalculation();

        // do supply actions
        model.onEachTile(checkForRepairTargets, true, true, model.turnOwner);
        model.onEachTile(checkForSupplyTargets, true, false, model.turnOwner);

        statemachine.changeState("ANIMATION_NEXT_TURN");
    }
};

// --------------------------------------------------------------------------------------------------------



exports.action = {
    noAutoWait: true,

    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function (unit) {
        return explode.canSelfDestruct(unit);
    },

    invoke: function (x, y, range, damage) {
        explode(x, y, range, damage);
    }
};

/* -----------------------------------------------  Module Actions ----------------------------------------------- */

exports.actionActivate = {

    condition: function (player) {
        return exports.canActivatePower(player, exports.POWER_LEVEL_COP);
    },

    hasSubMenu: true,
    prepareMenu: function (player, menu) {
        menu.addEntry("cop");
        if (exports.canActivatePower(player, exports.POWER_LEVEL_SCOP)) {
            menu.addEntry("scop");
        }
    },

    invoke: function (playerId, powerLevel) {
        exports.activatePower(model.getPlayer(playerId), powerLevel);
    }
};

/*
 cwt.Action.unitAction({
 key:"attachCommander",

 condition: function(data){
 return model.events.attachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "co_attachCommander",
 model.round_turnOwner,
 data.source.unitId
 );
 }
 });
 */

/*
 cwt.Action.unitAction({
 key:"detachCommander",

 condition: function(data){
 return model.events.detachCommander_check(

 model.round_turnOwner
 );
 },

 invoke: function( data ){
 controller.commandStack_sharedInvokement(
 "detachCommander_invoked",
 model.round_turnOwner,
 data.target.x,
 data.target.y
 );
 }
 });
 */

exports.action = {
    relation: ["S", "T", relation.RELATION_SAME_THING, relation.RELATION_NONE],
    relationToProp: ["S", "T", relation.RELATION_ENEMY, relation.RELATION_NEUTRAL],

    condition: function (unit, property) {
        return ( exports.canCapture(unit) && exports.canBeCaptured(property));
    },

    invoke: function (propertyId, unitId) {
        exports.captureProperty(
            model.getProperty(propertyId),
            model.getUnit(unitId)
        );
    }
};



exports.ATTACKABLE = 1;

exports.MOVE_AND_ATTACKABLE = 2;

exports.MOVABLE = 3;



// Returns **true** if an **unit** has targets in sight from a given position (**x**,**y**), else **false**. If
// **moved** is true, then the given **unit** will move before attack. In case of indirect units this method will
// return **false** then because indirect units aren't allowed to move and attack in the same turn.
// The method will return **true** when at least one target is in range, else **false**.
//
exports.hasTargets = function (unit, x, y, moved) {
    if (moved && exports.isIndirect(unit)) return false;
    return exports.calculateTargets(unit, x, y);
};

//
// Calculates the targets of a **unit**. If selection **data** is given, then the attack targets will be marked. If
// **markTiles** is true, then **data** has to be given too. Furthermore when **markTiles** is true, then every tile
// in range will be marked. The method will return **true** when at least one target is in range, else **false** or
// **false** in every case when **markTiles** is true.
//
exports.calculateTargets = function (unit, x, y, selection, markRangeInSelection) {
    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
        assert(model.isValidPosition(x, y));
    }

    var markInData = (typeof selection !== "undefined");
    var teamId = unit.owner.team;
    var attackSheet = unit.type.attack;
    var targetInRange = false;

    // no battle unit ?
    if (typeof attackSheet === "undefined") {
        return false;
    }

    // a unit may does not have ammo but a weapon that needs ammo to fire
    if (!markRangeInSelection) {
        if (exports.hasMainWeapon(unit) && !exports.hasSecondaryWeapon(unit) && unit.type.ammo > 0 && unit.ammo === 0) {
            return false;
        }
    }

    // extract range
    var minR = 1;
    var maxR = 1;
    if (unit.type.attack.minrange) {
        minR = unit.type.attack.minrange;
        maxR = unit.type.attack.maxrange;
    }

    var lY = y - maxR;
    var hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= model.mapHeight) hY = model.mapHeight - 1;
    for (; lY <= hY; lY++) {

        var lX = x - maxR;
        var hX = x + maxR;
        if (lX < 0) lX = 0;
        if (hX >= model.mapWidth) hX = model.mapWidth - 1;
        for (; lX <= hX; lX++) {

            var tile = model.mapData[lX][lY];
            var dis = model.getDistance(x, y, lX, lY);

            if (dis >= minR && dis <= maxR) {

                // if markRangeInSelection is true, then mark all tiles in range
                if (markRangeInSelection) {
                    var nValue = exports.ATTACKABLE;

                    switch (selection.getValue(lX, lY)) {
                        case exports.MOVABLE:
                        case exports.MOVE_AND_ATTACKABLE:
                            nValue = exports.MOVE_AND_ATTACKABLE;
                            break;
                    }

                    selection.setValue(lX, lY, nValue);
                    continue;

                } else if (tile.visionTurnOwner === 0) {
                    // drop tile when hidden in fog
                    continue;

                } else {
                    var dmg = constants.INACTIVE;

                    var tUnit = tile.unit;
                    if (tUnit && tUnit.owner.team !== teamId) {

                        dmg = exports.getBaseDamageAgainst(unit, tUnit);
                        if (dmg > 0) {
                            targetInRange = true;

                            // if mark tile is true, then mark them in the selection map else return true
                            if (markInData) {
                                selection.setValue(lX, lY, dmg);
                            } else {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    return targetInRange;
};

var fillRangeDoAttackRange = {
    unit: null,

    // Expects a filed selection map (with movable tiles) and adds the attack range from every movable tile.
    //
    doIt: function (x, y, value, selection) {
        exports.calculateTargets(this.unit, x, y, selection, true);
        selection.setValue(x, y, exports.ATTACKABLE);
    }
};

var fillRangeDoMoveCheck = {
    doIt: function (x, y, value, selection) {
        var tile = model.mapData[x][y];
        selection.setValue(x, y, (tile.visionTurnOwner > 0 && tile.unit ? constants.INACTIVE : exports.MOVABLE));
    }
};

var fillRangeLock = false;

exports.fillRangeMap = function (unit, x, y, selection) {
    assert(!fillRangeLock, "cannot call fillRangeMap twice at the same time");
    fillRangeLock = true;

    selection.clear();

    if (exports.isDirect(unit)) {

        fillRangeDoAttackRange.unit = unit;

        // movable unit -> check attack from every movable position
        move.fillMoveMap(null, selection, x, y, unit);
        selection.onAllValidPositions(0, constants.MAX_SELECTION_RANGE, fillRangeDoMoveCheck);
        selection.onAllValidPositions(exports.MOVE_AND_ATTACKABLE, exports.MOVABLE, fillRangeDoAttackRange);

        fillRangeDoAttackRange.unit = null;

    } else {

        // non movable unit -> check attack from position {x,y}
        exports.calculateTargets(unit, x, y, selection, true);
    }

    fillRangeLock = false;
};

// Returns the **base damage value as integer** of an **attacker** against a **defender**. If the attacker cannot
// attack the defender then **cwt.INACTIVE** will be returned. This function recognizes the ammo usage of main
// weapons. If the attacker cannot attack with his main weapon due low ammo then only the secondary weapon will
// be checked. If **withMainWp** is false (default = true) then the main weapon check will be skipped.
//
exports.getBaseDamageAgainst = function (attacker, defender, withMainWp) {
    var attack = attacker.type.attack;

    if (!attack) {
        return constants.INACTIVE;
    }

    var tType = defender.type.ID;
    var v;

    if (typeof withMainWp === "undefined") {
        withMainWp = true;
    }

    // check main weapon
    if (withMainWp && typeof attack.main_wp !== "undefined" && attacker.ammo > 0) {
        v = attack.main_wp[tType];
        if (typeof v !== "undefined") {
            return v;
        }
    }

    // check secondary weapon
    if (typeof attack.sec_wp !== "undefined") {
        v = attack.sec_wp[tType];
        if (typeof v !== "undefined") {
            return v;
        }
    }

    return constants.INACTIVE;
};

// Returns the **battle damage as integer** of an **attacker** against an **defender** with a given amount of
// **luck** as integer. If **withMainWp** is false (default = true) then the main weapon usage will be skipped.
// If **isCounter** is true (default = false), then the attack will be interpreted as counter attack.
//
exports.getBattleDamageAgainst = function (attacker, defender, luck, withMainWp, isCounter) {
    if (typeof isCounter === "undefined") {
        isCounter = false;
    }

    var BASE = exports.getBaseDamageAgainst(attacker, defender, withMainWp);
    if (BASE === constants.INACTIVE) {
        return constants.INACTIVE;
    }

    var AHP = model.Unit.healthToPoints(attacker);
    var LUCK = parseInt((luck / 100) * 10, 10);
    var ACO = 100;
    if (isCounter) ACO += 0;

    var def = model.grabTileByUnit(defender).type.defense;
    var DCO = 100;
    var DHP = model.Unit.healthToPoints(defender);
    var DTR = parseInt(def * 100 / 100, 10);

    var damage;
    if (model.gameMode <= model.GAME_MODE_AW2) {
        damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);
    } else {
        damage = BASE * (ACO / 100 * DCO / 100) * (AHP / 10);
    }

    return parseInt(damage, 10);
};

//
// Declines when the attacker does not have targets in range.
//
// @param attId
// @param defId
// @param attLuckRatio
// @param defLuckRatio
//
exports.attack = function (attacker, defender, attLuckRatio, defLuckRatio) {
    if (attLuckRatio < 0 || attLuckRatio > 100) { throw new Error("IllegalLuckValueException: attacker"); }
    if (defLuckRatio < 0 || defLuckRatio > 100) { throw new Error("IllegalLuckValueException: defender"); }

    // TODO
    // **check_ firstCounter:** if first counter is active then the defender
    // attacks first. In this case swap attacker and defender.
    /*
     if (!indirectAttack && controller.scriptedValue(defender.owner, "firstCounter", 0) === 1) {
     if (!model.battle_isIndirectUnit(defId)) {
     var tmp_ = defender;
     defender = attacker;
     attacker = tmp_;
     }
     }
     */

    var indirectAttack = this.isIndirect(attacker);
    var aSheets = attacker.type;
    var dSheets = defender.type;
    var attOwner = attacker.owner;
    var defOwner = defender.owner;
    var powerAtt = model.Unit.healthToPoints(defender);
    var powerCounterAtt = model.Unit.healthToPoints(attacker);
    var mainWpAttack = this.canUseMainWeapon(attacker, defender);
    var damage = this.getBattleDamageAgainst(attacker, defender, attLuckRatio, mainWpAttack, false);

    if (damage !== cwt.INACTIVE) {
        defender.takeDamage(damage);
        if (defender.hp <= 0) {
            // TODO destroy unit
        }

        powerAtt -= cwt.UnitClass.healthToPoints(defender);

        if (mainWpAttack) {
            attacker.ammo--;
        }

        powerAtt = ( parseInt(powerAtt * 0.1 * dSheets.cost, 10) );
        cwt.CO.modifyStarPower(attOwner, parseInt(0.5 * powerAtt, 10));
        cwt.CO.modifyStarPower(defOwner, powerAtt);
    }

    // counter attack when defender survives and defender is an indirect attacking unit
    if (defender.hp > 0 && !this.isIndirect(defender)) {
        mainWpAttack = this.canUseMainWeapon(defender, attacker);

        damage = this.getBattleDamageAgainst(defender, attacker, defLuckRatio, mainWpAttack, true);

        if (damage !== -1) {
            attacker.takeDamage(damage);
            if (attacker.hp <= 0) {
                // TODO destroy unit
            }

            powerCounterAtt -= cwt.UnitClass.healthToPoints(attacker);

            if (mainWpAttack) {
                defender.ammo--;
            }

            powerCounterAtt = ( parseInt(powerCounterAtt * 0.1 * aSheets.cost, 10) );
            cwt.CO.modifyStarPower(defOwner, parseInt(0.5 * powerCounterAtt, 10));
            cwt.CO.modifyStarPower(attOwner, powerCounterAtt);
        }
    }
};

exports.action = {
    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function (attacker, x, y, moved) {
        if (model.inPeacePhase()) {
            return false;
        }

        return attack.hasTargets(attacker, x, y, moved);
    },

    targetSelectionType: "A",
    prepareTargets: function (unit, x, y, selection) {
        attack.calculateTargets(unit, x, y, selection);
    },

    invoke: function (attackerId, defenderId, luckAttacker, luckDefender) {
        attack.attack(
            model.getUnit(attackerId),
            model.getUnit(defenderId),
            luckAttacker,
            luckDefender
        );
    }
};


/*
 cwt.assert(Array.isArray(data.units));
 cwt.assert(Array.isArray(data.prps));
 cwt.assert(cwt.WeatherSheet.sheets.hasOwnProperty(data.wth));
 cwt.assert(data.trOw >= 0 && data.trOw < 9999999);
 cwt.assert(data.day >= 0 && data.day < 9999999);
 cwt.assert(data.gmTm >= 0);
 cwt.assert(data.tnTm >= 0);
 // check_ data
 cwt.assert(playerData[0] >= 0 && playerData[0] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(typeof playerData[1] === "string");
 cwt.assert(playerData[3] >= 0 && playerData[3] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(playerData[2] >= 0 && playerData[2] < 999999);
 cwt.assert(playerData[4] >= 0 && playerData[4] < 999999);

 // check_ map data
 cwt.assert(unitData[0] >= 0 && unitData[0] < cwt.Unit.MULTITON_INSTANCES);
 cwt.assert(cwt.UnitSheet.sheets.hasOwnProperty(unitData[1]));
 cwt.assert(that.isValidPosition(unitData[2], unitData[3]));
 cwt.assert(unitData[4] >= 1 && unitData[4] <= 99);

 var type = cwt.UnitSheet.sheets[unitData[1]];
 cwt.assert(unitData[5] >= 0 && unitData[5] <= type.ammo);
 cwt.assert(unitData[6] >= 0 && unitData[6] <= type.fuel);
 cwt.assert(typeof unitData[7] === "number");
 cwt.assert(unitData[8] >= -1 && unitData[8] < cwt.Player.MULTITON_INSTANCES);
 cwt.assert(unitData.length < 10 || typeof unitData[9] === "boolean");
 cwt.assert(unitData.length < 11 || typeof unitData[10] === "boolean");


 // check_ map data
 cwt.assert(propData[0] >= 0 && propData[0] < cwt.Property.MULTITON_INSTANCES);
 cwt.assert(propData[1] >= 0 && propData[1] < that.width);
 cwt.assert(propData[2] >= 0 && propData[2] < that.height);
 cwt.assert(cwt.PropertySheet.sheets.hasOwnProperty(propData[3]));
 cwt.assert(propData[5] >= -1 && propData[5] < cwt.Player.MULTITON_INSTANCES);

 //cwt.assert(
 //  (util.isString(propData[3]) && !util.isUndefined(model.data_tileSheets[propData[3]].capturePoints)) ||
 //    typeof model.data_tileSheets[propData[3]].cannon !== "undefined" ||
 //    typeof model.data_tileSheets[propData[3]].laser !== "undefined" ||
 //    typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
 //);

 //cwt.assert((util.intRange(propData[4], 1, // capture points
 //  model.data_tileSheets[propData[3]].capturePoints)) ||
 // (util.intRange(propData[4], -99, -1)) ||
 //  typeof model.data_tileSheets[propData[3]].rocketsilo !== "undefined"
 //);





 (function () {

 function placeCannonMetaData(x, y) {
 var prop = model.property_posMap[x][y];
 var cannon = prop.type.cannon;
 var size = prop.type.bigProperty;

 cwt.assert(x - size.x >= 0);
 cwt.assert(y - size.y >= 0);

 var ax = x - size.actor[0];
 var ay = y - size.actor[1];
 var ox = x;
 var oy = y;
 for (var xe = x - size.x; x > xe; x--) {

 y = oy;
 for (var ye = y - size.y; y > ye; y--) {

 // place blocker
 if (x !== ox || y !== oy) {
 if (this.DEBUG) util.log("creating invisible property at", x, ",", y);
 model.events.property_createProperty(prop.owner, x, y, "PROP_INV");
 }

 // place actor
 if (x === ax && y === ay) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 }

 }
 }
 }

 // // Places the necessary meta units for bigger properties.
 //
 model.event_on("gameround_start", function () {
 for (var x = 0, xe = model.map_width; x < xe; x++) {
 for (var y = 0, ye = model.map_height; y < ye; y++) {

 var prop = model.property_posMap[x][y];
 if (prop) {

 if (prop.type.bigProperty && prop.type.cannon) {
 placeCannonMetaData(x, y);
 } else if (prop.type.cannon) {
 if (this.DEBUG) util.log("creating cannon unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "CANNON_UNIT_INV");
 } else if (prop.type.laser) {
 if (this.DEBUG) util.log("creating laser unit at", x, ",", y);
 model.events.createUnit(model.unit_getFreeSlot(prop.owner), prop.owner,
 x, y, "LASER_UNIT_INV");
 }

 }
 }
 }
 });

 })();
 //*/