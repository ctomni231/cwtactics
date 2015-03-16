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