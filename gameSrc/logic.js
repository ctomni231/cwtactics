"use strict";

var constants = require("./constants");
var relation = require("./relationship");
var renderer = require("./renderer");
var actions = require("./actions");
var sheets = require("./sheets");
var model = require("./model");
var debug = require("./debug");
var util = require("./utility");

// --------------------------------------------------------------------------------------------------------

actions.createAction("wait", actions.UNIT_ACTION, {

    relation: ["S", "T",
        relation.RELATION_NONE,
        relation.RELATION_SAME_THING],

    condition: function (unit) {
        return unit.canAct;
    },

    invoke: function (unitId) {
        debug.logInfo("send unit "+unitId+" into wait status");

        model.getUnit(unitId).setActable(false);
        renderer.renderUnitsOnScreen();
    }
});

// --------------------------------------------------------------------------------------------------------

// some config objects
var cfgRandomDays = require("../config").getConfig("weatherRandomDays");
var cfgMinDays = require("../config").getConfig("weatherMinDays");

/**
 * Returns a random weather ID in relation to the current action weather.
 */
exports.generateWeatherId = function () {
    var newTp;

    // Search a random weather if the last weather was `null` or the default weather type
    if (model.weather && model.weather === sheets.getDefaultWeather()) {
        newTp = selectRandom(sheets.getIdList(sheets.TYPE_WEATHER), model.weather.ID);

    } else {
        // Take default weather and calculate a random amount of days
        newTp = sheets.getDefaultWeather();
    }

    return newTp.ID;
};

/**
 * Picks a random duration for a given weather type.
 *
 * @param type
 * @return {number}
 */
exports.generateDuration = function (type) {
    return (type === sheets.getDefaultWeather().ID) ? 1 :
        (cfgMinDays.value + parseInt(cfgRandomDays.value * Math.random(), 10));
};

exports.changeWeatherAction = {
    invoke: function (weather, duration) {
        model.weather = weather;
        model.weatherLeftDays = duration;

        fog.fullRecalculation();
    }
};

// --------------------------------------------------------------------------------------------------------

/**
 * @param {Unit} unit
 * @return true if the unit with id tid is a transporter, else false.
 */
exports.isTransportUnit = function (unit) {
    if (constants.DEBUG) assert(unit instanceof model.Unit);
    return (unit.type.maxloads > 0);
};

/**
 * Has a transporter unit with id tid loaded units?
 *
 * @param {Unit} unit
 * @return {boolean} true if yes, else false.
 */
exports.hasLoads = function (unit) {
    if (constants.DEBUG) assert(unit instanceof model.Unit);

    for (var i = 0, e = model.units.length; i < e; i++) {
        if (unit.loadedIn === model.units[i]) {
            return true;
        }
    }

    return false;
};

/**
 * Returns true if a transporter with id tid can loadGameConfig the unit with the id lid.
 * This function also calculates the resulting weight if the transporter would
 * loadGameConfig the unit. If the calculated weight is greater than the maximum loadable
 * weight false will be returned.
 *
 * @param {Unit} transporter
 * @param {Unit} load
 * @return {boolean}
 */
exports.canLoadUnit = function (transporter, load) {
    if (constants.DEBUG) {
        assert(transporter instanceof model.Unit);
        assert(load instanceof model.Unit);
        assert(load !== transporter);
        assert(exports.isTransportUnit(transporter));
        assert(load.loadedIn !== transporter);
    }

    return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
};

/**
 * Loads the unit with id lid into a transporter with the id tid.
 *
 * @param {Unit} transporter
 * @param {Unit} load
 */
exports.loadGameConfig = function (transporter, load) {
    if (load === transporter) throw new Error("LoadException: same unit");
    if (load.loadedIn) throw new Error("LoadException: unit already loaded");

    load.loadedIn = transporter;
};

/**
 * Unloads the unit with id lid from a transporter with the id tid.
 *
 * @param {Unit} transport
 * @param {Unit} load
 */
exports.unload = function (transporter, load) {
    if (load.loadedIn !== transporter) throw new Error("UnloadException: not in transporter");

    load.loadedIn = null;
};

/**
 * Returns true if a transporter unit can unload one of it's loads at a given position.
 * This functions understands the given pos as possible position for the transporter.
 *
 * @param {Unit} transporter
 * @param {Number} x
 * @param {Number} y
 * @return {boolean}
 */
exports.canUnloadSomethingAt = function (transporter, x, y) {
    var pid = transporter.owner;
    var unit;

    if (constants.DEBUG) assert(exports.isTransportUnit(transporter));
    for (var i = 0, e = model.units.length; i < e; i++) {

        unit = model.units[i];
        if (unit.loadedIn === transporter) {
            var moveType = sheets.getSheet(sheets.TYPE_MOVETYPE, unit.type.movetype);

            if (move.canTypeMoveTo(moveType, x - 1, y)) return true;
            if (move.canTypeMoveTo(moveType, x + 1, y)) return true;
            if (move.canTypeMoveTo(moveType, x, y - 1)) return true;
            if (move.canTypeMoveTo(moveType, x, y + 1)) return true;
        }
    }

    return false;
};

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


/**
 * Different available money transfer steps.
 *
 * @inner
 */
var MONEY_TRANSFER_STEPS = [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
];

/**
 * Returns `true` when a player can transfer money to a tile owner.
 *
 * @param player
 * @param x
 * @param y
 * @returns {*}
 */
exports.canTransferMoney = function (player, x, y) {
    if (player.gold < MONEY_TRANSFER_STEPS[0]) {
        return false;
    }

    // only transfer money on headquarters
    var property = model.getTile(x, y).property;
    return (property && property.type.looseAfterCaptured && property.owner !== player);
};

/**
 * Returns `true` when a player can transfer money to a tile owner.
 *
 * @param player
 * @param menuObject
 */
exports.getTransferMoneyTargets = function (player, menuObject) {
    var i, e;
    for (i = 0, e = MONEY_TRANSFER_STEPS.length; i < e; i++) {
        if (player.gold >= MONEY_TRANSFER_STEPS[i]) {
            menuObject.addEntry(MONEY_TRANSFER_STEPS[i]);
        }
    }
};

/**
 * Transfers money from one player to another player.
 *
 * @param playerA
 * @param playerB
 * @param money
 */
exports.transferMoney = function (playerA, playerB, money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    assert(playerA.gold >= 0);
};

/**
 *
 * @param unit
 * @returns {boolean}
 */
exports.canTransferUnit = function (unit) {

    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
    }

    return !transport.hasLoads(unit);
};

/**
 *
 * @param player
 * @param menu
 */
exports.getUnitTransferTargets = function (player, menu) {
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

/**
 *
 * @param unit
 * @param player
 */
exports.transferUnitToPlayer = function (unit, player) {
    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
        assert(player instanceof model.Player);
    }

    var origPlayer = unit.owner;

    if (constants.DEBUG) assert(player.numberOfUnits < constants.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
        model.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
};

/**
 *
 * @param property
 * @returns {boolean}
 */
exports.canTransferProperty = function (property) {
    return (property.type.notTransferable !== true);
};

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

var changeVision_ = function (x, y, object, oldOwner) {
    if (object instanceof model.Unit) {
        cwt.Fog.removeUnitVision(x, y, oldOwner);
        cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
        cwt.Fog.removePropertyVision(x, y, oldOwner);
        cwt.Fog.addPropertyVision(x, y, object.owner);
    }
};

//
//
//
exports.transferPropertyToPlayer = function (property, player) {
    var origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team !== player.team) {
        // TODO
        model.searchProperty(property, changeVision_, null, origPlayer);
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

// --------------------------------------------------------------------------------------------------------

exports.action = {
    invoke: function () {
        stateData.fromIngameToOptions = true;
        states.changeState("MENU_OPTIONS");
    }
};

// --------------------------------------------------------------------------------------------------------


// Returns **true** when the given **unit** is the mechanical laser trigger, else **false**.
//
exports.isLaser = function (unit) {
    if (constants.DEBUG) assert(unit instanceof model.Unit);
    return (unit.type.ID === sheets.LASER_UNIT_INV);
};

// Fires a laser at a given position (**x**,**y**).
//
exports.fireLaser = function (x, y) {
    var map = model.mapData;
    var prop = map[x][y].property;

    if (constants.DEBUG) assert(prop && prop.type.laser);

    var ox = x;
    var oy = y;
    var savedTeam = prop.owner.team;
    var damage = model.Unit.pointsToHealth(prop.type.laser.damage);

    // every tile on the cross ( same y or x coordinate ) will be damaged
    for (var x = 0, xe = model.mapWidth; x < xe; x++) {
        var doIt = false;

        if (x === ox) {
            for (var y = 0, ye = model.mapHeight; y < ye; y++) {
                if (oy !== y) {
                    var unit = map[x][y].unit;
                    if (unit && unit.owner.team !== savedTeam) {
                        unit.takeDamage(damage, 9);
                    }
                }
            }
        } else {
            var unit = map[x][y].unit;
            if (unit && unit.owner.team !== savedTeam) {
                unit.takeDamage(damage, 9);
            }
        }
    }
};

//
// Returns true if a property id is a rocket silo. A rocket silo has the ability to fire a rocket to a
// position with an impact.
//
exports.isRocketSilo = function (property) {
    if (constants.DEBUG) assert(property instanceof model.Property);
    return (property.type.rocketsilo != undefined);
};

//
// Returns **true** when a silo **property** can be triggered by a given **unit**. If not, **false** will be returned.
//
exports.canBeFiredBy = function (property, unit) {
    if (constants.DEBUG) {
        assert(unit instanceof model.Unit);
        assert(exports.isRocketSilo(property));
    }

    return (property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1);
};

//
// Returns **true** if a given silo **property** can be fired to a given position (**x**,**y**). If not, **false**
// will be returned.
//
exports.canBeFiredTo = function (property, x, y) {
    if (constants.DEBUG) assert(exports.isRocketSilo(property));
    return (model.isValidPosition(x, y));
};

// inline function
var doDamage = function (x, y, tile, damage) {
    var unit = tile.unit;
    if (unit) {
        unit.takeDamage(damage, 9);
    }
};

//
// Fires a rocket from a given rocket silo at position (**x**,**y**) to a given target
// position (**tx**,**ty**) and inflicts damage to all units in the range of the explosion. The health of the units
// will be never lower as 9 health after the explosion.
//
exports.fireSilo = function (x, y, tx, ty) {
    var silo = model.mapData[x][y].property;

    if (this.DEBUG) assert(this.isRocketSilo(silo));

    // change silo type to empty
    var type = silo.type;
    silo.type = sheets.properties.sheets[type.changeTo];

    var damage = model.Unit.pointsToHealth(type.rocketsilo.damage);
    var range = type.rocketsilo.range;

    model.doInRange(tx, ty, range, doDamage, damage);
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
// Returns **true** if a given **unit** is a cannon trigger unit, else **false**.
//
exports.isCannonUnit = function (unit) {
    if (cwt.DEBUG) {
        cwt.assert(unit instanceof cwt.UnitClass);
    }

    return (unit.type.ID === cwt.DataSheets.CANNON_UNIT_INV);
};

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

exports.actionHide = {
    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function (unit) {
        return (unit.type.stealth && !unit.hidden);
    },

    invoke: function (unitId) {
        model.getUnit(unitId).hidden = true;
    }
};

exports.actionUnhide = {
    relation: ["S", "T", relation.RELATION_NONE, relation.RELATION_SAME_THING],

    condition: function (unit) {
        return (unit.type.stealth && unit.hidden);
    },

    invoke: function (unitId) {
        model.getUnit(unitId).hidden = false;
    }
};

// --------------------------------------------------------------------------------------------------------


/**
 * @return **true** if a given **unit** is a supplier, else **false**.
 *
 * @param {Unit} unit
 */
exports.isSupplier = function(unit) {
    return unit.type.supply;
};

/**
 * Returns **true** if a supplier at a given position (**x**,**y**) has
 * objects nearby which can be supplied.
 *
 * @param {Unit} supplier
 * @param {number} x
 * @param {number} y
 * @return **true** if a **supplier** unit can support units in the near of a given tile at the position, else **false**.
 */
exports.hasRefillTargetsNearby = function(supplier, x, y) {
    if (exports.canRefillObjectAt(supplier, x + 1, y)) return true;
    else if (exports.canRefillObjectAt(supplier, x - 1, y)) return true;
    else if (exports.canRefillObjectAt(supplier, x, y + 1)) return true;
    else if (exports.canRefillObjectAt(supplier, x, y - 1)) return true;
    else return false;
};

/**
 *
 * @param {Unit} supplier
 * @param {number} x
 * @param {number} y
 * @return **true** if a **supplier** unit can support a given tile at the position (**x**,**y**), else **false**.
 */
exports.canRefillObjectAt = function(supplier, x, y) {
    var target = model.mapData[x][y].unit;
    return (model.isValidPosition(x, y) && target && target.owner === supplier.owner);
};

/**
 * Resupplies a unit at a given position.
 *
 * @param {number} x
 * @param {number} y
 */
exports.refillSuppliesByPosition = function(x, y) {
    var unit = model.mapData[x][y];
    exports.refillSupplies(unit);
};

/**
 * Refills the supplies of an unit.
 *
 * @param {Unit} unit
 */
exports.refillSupplies = function(unit) {
    unit.ammo = unit.type.ammo;
    unit.fuel = unit.type.fuel;
};

/**
 * Raises funds from a **property**.
 *
 * @param  {Property} property
 */
exports.raiseFunds = function(property) {
    if (typeof property.type.funds) {
        property.owner.gold += property.type.funds;
    }
};

/**
 * Drains fuel of a **unit** if it has the ability of daily fuel usage.
 *
 * @param {Unit} unit
 */
exports.drainFuel = function(unit) {
    var v = unit.type.dailyFuelDrain;
    if (typeof v === "number") {

        // hidden units may drain more fuel
        if (this.hidden && this.type.dailyFuelDrainHidden) {
            v = this.type.dailyFuelDrainHidden;
        }

        this.fuel -= v;
    }
};

//
// Returns **true** if the property at the position (**x**,**y**) fulfills the following requirements
//  a) the property has a healing ability
//  b) the property is occupied by an unit of the same team
//  c) the occupying unit can be healed by the property
//
// The value **false** will be returned if one of the requirements fails.
//
exports.canPropertyRepairAt = function(x, y) {
    var tile = model.mapData[x][y];
    var prop = tile.property;
    var unit = tile.unit;
    if (prop && unit) {
        if (typeof prop.type.repairs[unit.movetype.ID] === "number") {
            return true;
        }
    }
    return false;
};

//
// The property will heal the unit that occupies the tile where the property is in. The following requirements must
// be fulfilled.
//  a) the property has a healing ability
//  b) the property is occupied by an unit of the same team
//  c) the occupying unit can be healed by the property
//
exports.propertyRepairsAt = function(x, y) {
    var tile = model.mapData[x][y];
    var prop = tile.property;
    var unit = tile.unit;

    var repairs = prop.type.repairs;
    var amount = (repairs[unit.type.movetype.ID] || repairs[unit.type.ID]);

    unit.heal(amount, true);
};


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

// --------------------------------------------------------------------------------------------------------

var cfgUnitLimit = require("../config").getConfig("unitLimit");

//
// Returns **true** when the given **property** is a factory, else **false**.
//
exports.isFactory = function (property) {
    if (constants.DEBUG) assert(property instanceof model.Property);

    return (property.type.builds !== undefined);
};

//
// Returns **true** when the given **property** is a factory and can produce something technically, else **false**.
//
exports.canProduce = function (property) {
    if (constants.DEBUG) assert(exports.isFactory(property));

    // check left manpower
    if (!property.owner || !property.owner.manpower) return false;

    // check unit limit and left slots
    var count = property.owner.numberOfUnits;
    var uLimit = (cfgUnitLimit.value || 9999999);
    if (count >= uLimit || count >= constants.MAX_UNITS) return false;

    return true;
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

// Modifies a vision at a given position and player id.
//
var modifyVision_ = function (x, y, owner, range, value) {

    // ignore neutral objects
    if (owner.team === constants.INACTIVE) return;

    if (cfgFogEnabled.value !== 1) return;

    var clientVisible = owner.clientVisible;
    var turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) return;

    var map = model.mapData;
    if (range === 0) {
        if (clientVisible) map[x][y].visionClient += value;
        if (turnOwnerVisible) map[x][y].visionTurnOwner += value;

    } else {
        var mW = model.mapWidth;
        var mH = model.mapHeight;
        var lX;
        var hX;
        var lY = y - range;
        var hY = y + range;

        if (lY < 0) lY = 0;
        if (hY >= mH) hY = mH - 1;
        for (; lY <= hY; lY++) {

            var disY = Math.abs(lY - y);
            lX = x - range + disY;
            hX = x + range - disY;
            if (lX < 0) lX = 0;
            if (hX >= mW) hX = mW - 1;
            for (; lX <= hX; lX++) {

                // does the tile block vision ?
                if (map[lX][lY].type.blocksVision && model.getDistance(x, y, lX, lY) > 1) continue;

                if (clientVisible) map[lX][lY].visionClient += value;
                if (turnOwnerVisible) map[lX][lY].visionTurnOwner += value;
            }
        }
    }
};

//
// Completely recalculates the fog aw2.
//
exports.fullRecalculation = function () {
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var fogEnabled = (cfgFogEnabled.value === 1);
    var map = model.mapData;

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {

            if (!fogEnabled) {
                map[x][y].visionTurnOwner = 1;
                map[x][y].visionClient = 1;
            } else {
                map[x][y].visionTurnOwner = 0;
                map[x][y].visionClient = 0;
            }
        }
    }

    // 2. add vision-object
    if (fogEnabled) {
        var vision;
        var unit;
        var tile;
        var property;

        for (x = 0; x < xe; x++) {
            for (y = 0; y < ye; y++) {
                tile = map[x][y];

                unit = tile.unit;
                if (unit !== null) {
                    vision = unit.type.vision;
                    if (vision < 0) vision = 0;

                    modifyVision_(x, y, unit.owner, vision, 1);
                }

                property = tile.property;
                if (property !== null && property.owner !== null) {
                    vision = property.type.vision;
                    if (vision < 0) vision = 0;

                    modifyVision_(x, y, property.owner, vision, 1);
                }
            }
        }
    }
};

// Removes a vision-object from the fog map.
//
exports.removeVision = function (x, y, owner, range) {
    modifyVision_(x, y, owner, range, -1);
};

exports.removeUnitVision = function (x, y, owner) {
    var unit = model.mapData[x][y].unit;
    if (!owner) owner = unit.owner;

    exports.removeVision(x, y, owner, unit.type.vision);
};

exports.removePropertyVision = function (x, y, owner) {
    var prop = model.mapData[x][y].property;
    if (!owner) owner = prop.owner;

    exports.removeVision(x, y, owner, prop.type.vision);
};

//
// Adds a vision-object from the fog map.
//
exports.addVision = function (x, y, owner, range) {
    modifyVision_(x, y, owner, range, +1);
};

exports.addUnitVision = function (x, y, owner) {
    var unit = model.mapData[x][y].unit;
    if (!owner) owner = unit.owner;

    exports.addVision(x, y, owner, unit.type.vision);
};

exports.addPropertyVision = function (x, y, owner) {
    var prop = model.mapData[x][y].property;
    if (!owner) owner = prop.owner;

    exports.addVision(x, y, owner, prop.type.vision);
};

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


/**
 * Returns **true** if two units can join each other, else **false**. In general both **source** and **target** has
 * to be units of the same type and the target must have 9 or less health points. Transporters cannot join each
 * other when they contain loaded units.
 *
 * @param source
 * @param target
 * @returns {boolean}
 */
exports.canJoin = function (source, target) {
    if (!source instanceof model.Unit || !target instanceof model.Unit) {
        throw new Error("IllegalArgumentType(s)");
    }

    if (source.type !== target.type) {
        return false;
    }


    // don't increase HP to more then 10
    if (target.hp >= 90) {
        return false;
    }

    // do they have loads?
    if (transport.hasLoads(source) || transport.hasLoads(target)) return false;

    return true;
};

/**
 * Joins two units together. If the combined health is greater than the maximum health then the difference will
 * be payed to the owners resource depot.
 *
 * @param source
 * @param x
 * @param y
 */
exports.join = function (source, x, y) {
    if (!source instanceof model.Unit || !model.isValidPosition(x, y)) {
        throw new Error("IllegalArgumentType(s)");
    }

    var target = model.getTile(x, y).unit;
    if (source.type !== target.type) {
        throw new Error("IncompatibleJoinTypes");
    }

    // hp
    target.heal(model.Unit.pointsToHealth(model.Unit.healthToPoints(source)), true);

    // ammo
    target.ammo += source.ammo;
    if (target.ammo > target.type.ammo) {
        target.ammo = target.type.ammo;
    }

    // fuel
    target.fuel += source.fuel;
    if (target.fuel > target.type.fuel) {
        target.fuel = target.type.fuel;
    }

    // TODO experience points

    // TODO use correct action here
    cwt.Lifecycle.destroyUnit(x, y, true);
};

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

/**
 * Returns an inactive **unit object** or **null** if every slot in the unit list is used.
 *
 * @returns {*}
 */
exports.getInactiveUnit = function () {
    var i, e;
    for (i = 0, e = model.units.length; i < e; i++) {
        if (!model.units[i].owner) {
            return model.units[i];
        }
    }
    return null;
};

//
//
// @param {number} x
// @param {number} y
// @param {cwt.Player|cwt.Unit|cwt.Property} player
// @param type
//
exports.createUnit = function (x, y, player, type) {
    if (constants.DEBUG) assert(model.isValidPosition(x, y));

    var tile = model.mapData[x][y];

    if (constants.DEBUG) assert(player instanceof model.Player && player.numberOfUnits < constants.MAX_UNITS);

    var unit = exports.getInactiveUnit();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(sheet.units.sheets[type]);

    fog.addUnitVision(x, y, player);
};

//
//
// @param {number} x
// @param {number} y
// @param {boolean} silent
//
exports.destroyUnit = function (x, y, silent) {
    var tile = model.mapData[x][y];

    if (constants.DEBUG) assert(tile.unit);

    fog.removeUnitVision(x, y, tile.unit.owner);

    //TODO check loads

    // remove references
    var owner = tile.unit.owner;
    owner.numberOfUnits--;

    if (constants.DEBUG) assert(owner.numberOfUnits >= 0);

    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (cfgNoUnitsLeftLoose.value === 1 && owner.numberOfUnits === 0) {
        this.deactivatePlayer(owner);
    }
};

//
// A player has loosed the game round due a specific reason. This
// function removes all of his units and properties. Furthermore
// the left teams will be checked. If only one team is left then
// the end game event will be invoked.
//
// @param {cwt.Player} player
//
exports.deactivatePlayer = function (player) {

    // drop units
    if (constants.DEBUG) assert(player instanceof model.Player);

    for (var i = 0, e = model.units.length; i < e; i++) {
        var unit = model.units[i];
        if (unit.owner === player) {
            // TODO
        }
    }

    // drop properties
    for (var i = 0, e = model.properties.length; i < e; i++) {
        var prop = model.properties[i];
        if (prop.owner === player) {
            prop.makeNeutral();

            // TODO: change type when the property is a changing type property
            var changeType = prop.type.changeAfterCaptured;
        }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft()) {
        // TODO
    }
};

//
//
// @return {boolean}
//
exports.hasFreeUnitSlot = function (player) {
    return player.numberOfUnits < model.Player.MAX_UNITS;
};

exports.destroyUnitAction = {

};

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

//
// Generates a path from a start position (**stx**,**sty**) to (**tx**,**ty**) with a given **selection** map. The
// result path will be stored in the **movePath**.
//
exports.generateMovePath = function (stx, sty, tx, ty, selection, movePath) {
    if (constants.DEBUG) {
        assert(model.isValidPosition(stx, sty));
        assert(model.isValidPosition(tx, ty));
    }

    var dir;
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
};

//
// Compares a given move **code** with a **movePath**. When the new code is the exact opposite direction of the
// last command in the path then **true** will be return else **false**.
//
var isGoBackCommand = function (code, movePath) {
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
};

//
// Appends a move `code` to a given `movePath` and returns `true` if the
// insertion was possible else `false`. If the new code is a backwards move
// to the previous tile in the path then the actual last tile will be
// dropped. In this function returns also `true` in this case.
//
exports.addCodeToMovePath = function (code, movePath, selection, sx, sy) {
    if (constants.DEBUG) assert(code >= exports.MOVE_CODES_UP && code <= exports.MOVE_CODES_LEFT);

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
};

//
// Little helper array object for `model.move_fillMoveMap`. This will be used only by one process. If the helper is
// not available then a temp object will be created in `model.move_fillMoveMap`. If the engine is used without client
// hacking then this situation never happen and the `model.move_fillMoveMap` will use this helper to prevent
// unnecessary array creation.
//
// @private
//
var fillMoveMapHelper = [];

//
// @private
//
var checkArray = [
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE,
    constants.INACTIVE
];

//
// Fills a **selection** map for move able tiles. If no explicit start position (**x**,**y**) and moving **unit**
// is given, then the **source** position object will be used to extract data.
//
exports.fillMoveMap = function (source, selection, x, y, unit) {
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
};

//
//
// @param {cwt.CircularBuffer} movePath
// @param {cwt.Position} source
// @param {cwt.Position} target
// @return {boolean}
//
exports.trapCheck = function (movePath, source, target) {
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
};

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
exports.move = function (unit, x, y, movePath, noFuelConsumption, preventRemoveOldPos, preventSetNewPos) {
    var map = model.mapData;
    var team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    var cX = x;
    var cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos !== true) {
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


/**
 * Returns **true** if the **unit** is capable to self destruct.
 *
 * @param unit
 * @returns {boolean}
 */
exports.canSelfDestruct = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return unit.type.suicide !== undefined;
};

/**
 * Returns the **health** that will be damaged by an explosion of the exploder **unit**.
 *
 * @param unit
 * @returns {number}
 */
exports.getExplosionDamage = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return model.Unit.pointsToHealth(unit.type.suicide.damage);
};

/**
 * Returns the explosion **range** of the exploder **unit**.
 *
 * @param unit
 * @returns {number} range in tiles
 */
exports.getSuicideRange = function (unit) {
    if (!exports.canSelfDestruct(unit)) {
        throw new Error("IllegalArgumentType");
    }

    return unit.type.suicide.range;
};

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} tile
 * @param {number} damage
 */
var doDamage = function (x, y, tile, damage) {
    if (!model.isValidPosition(x, y) || !tile instanceof model.Tile || typeof damage !== "number") {
        throw new Error("IllegalArgumentType(s)");
    }

    if (tile.unit) {

        // TODO use command from attack here
        tile.unit.takeDamage(damage, 9);
    }
}
// TODO: silo should use this for the impact


/**
 * Invokes an explosion with a given **range** at position (**x**,**y**). All units in the **range** will be
 * damaged by the value **damage**. The health of an unit in range will never be lower than 9 health after
 * the explosion (means it will have 1HP left).
 *
 * @param {number} x
 * @param {number} y
 * @param {number} range
 * @param {number} damage
 */
var explode = function (x, y, range, damage) {
    if (!model.isValidPosition(x, y)) {
        throw new Error("IllegalArgumentType(s)");
    }

    var tile = model.getTile(x, y);
    if (!exports.canSelfDestruct(tile.unit) || range < 1 || damage < 1 ) {
        throw new Error("IllegalArgumentType(s)");
    }

    // TODO use command from attack here
    cwt.Lifecycle.destroyUnit(x, y, false);

    model.doInRange(x, y, range, doDamage, damage);
};

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

// --------------------------------------------------------------------------------------------------------


// some config parameters
var cfgCoStartCostIncreaseSteps = require("../config").getConfig("co_getStarCostIncreaseSteps");
var cfgCoStartCostIncrease = require("../config").getConfig("co_getStarCostIncrease");
var cfgEnabledCoPower = require("../config").getConfig("co_enabledCoPower");
var cfgCoStartCost = require("../config").getConfig("co_getStarCost");


/**
 * Power level of normal CO power.
 *
 * @type {number}
 * @constant
 */
exports.POWER_LEVEL_COP = 0;

/**
 * Power level of normal super CO power.
 *
 * @type {number}
 * @constant
 */
exports.POWER_LEVEL_SCOP = 1;

/**
 * Modifies the power level of a **player** by a given **value**.
 *
 * @param player
 * @param value
 */
exports.modifyStarPower = function (player, value) {
    if (!player instanceof model.Player || typeof value === "number") {
        throw new Error("IllegalArgumentType");
    }

    player.power += value;

    // check left bound
    if (player.power < 0) {
        player.power = 0;
    }
};

/**
 * Returns **true** when a **player** can activate a **powerLevel**, else **false**. If the config
 * **co_enabledCoPower** if off then **false** will be returned in every situation.
 *
 * @param player
 * @param level
 * @returns {boolean}
 */
exports.canActivatePower = function (player, level) {
    if (!player instanceof model.Player || level < exports.POWER_LEVEL_COP || level > exports.POWER_LEVEL_SCOP) {
        throw new Error("IllegalArgumentType");
    }

    // TODO maybe better in the action itself
    // commanders must be available and current power must be inactive
    if (cfgEnabledCoPower.value === 0 || player.coA === null || player.activePower !== constants.INACTIVE) {
        return false;
    }

    var stars;
    switch (level) {

        case this.POWER_LEVEL_COP:
            stars = player.coA.coStars;
            break;

        case this.POWER_LEVEL_SCOP:
            if (model.gameMode < model.GAME_MODE_AW2) {
                throw new Error("GameModeActionIncompatibilityException");
            }

            stars = player.coA.scoStars;
            break;
    }

    return (player.power >= (exports.getStarCost(player) * stars));
};

/**
 * Activates a commander power **level** for a given **player**.
 *
 * @param player
 * @param level
 */
exports.activatePower = function (player, level) {
    if (!player instanceof model.Player || level < exports.POWER_LEVEL_COP || level > exports.POWER_LEVEL_SCOP) {
        throw new Error("IllegalArgumentType");
    }

    player.power = 0;
    player.activePower = level;
    player.powerUsed++;
};

/**
 * Deactivates the CO power of a **player** by setting the activePower to **cwt.INACTIVE**.
 *
 * @param player
 */
exports.deactivatePower = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    player.activePower = constants.INACTIVE;
};

/**
 * Returns the **costs** for one CO star for a **player**.
 *
 * @param player
 * @returns {behaviorTree.Config.value|*}
 */
exports.getStarCost = function (player) {
    if (!player instanceof model.Player) {
        throw new Error("IllegalArgumentType");
    }

    var cost = cfgCoStartCost.value;
    var used = player.powerUsed;

    // if usage counter is greater than max usage counter then use only the maximum increase counter for calculation
    if (used > cfgCoStartCostIncreaseSteps.value) {
        used = cfgCoStartCostIncreaseSteps.value;
    }

    cost += used * cfgCoStartCostIncrease.value;

    return cost;
};

/**
 * Sets the main Commander of a **player** to a given co **type**.
 *
 * @param player
 * @param type
 */
exports.setMainCo = function (player, type) {
    if (!player instanceof model.Player || !sheets.isValidId(sheets.TYPE_COMMANDER, type)) {
        throw new Error("IllegalArgumentType");
    }

    player.coA = type === null ? null : type;
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

// --------------------------------------------------------------------------------------------------------


/**
 * Returns **true** when a **unit** can capture a properties, else **false**.
 *
 * @param unit
 * @returns {boolean}
 */
exports.canCapture = function (unit) {
    if (!unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    return (unit.type.captures > 0);
};

/**
 * Returns **true** when a **property** can be captured, else **false**.
 *
 * @param property
 * @returns {boolean}
 */
exports.canBeCaptured = function (property) {
    if (!property instanceof model.Property) {
        throw new Error("IllegalArgumentType");
    }

    return (property.type.capturePoints > 0);
};

/**
 * The **unit** captures the **property**. When the capture points of the **property** falls down to zero, then
 * the owner of the **property** changes to the owner of the capturing **unit** and **true** will be returned. If
 * the capture points does not fall down to zero then **false** will be returned.
 *
 * @param property
 * @param unit
 * @returns {boolean} true when captured successfully, else when still some capture points left
 */
exports.captureProperty = function (property, unit) {
    if (!property instanceof model.Property || !unit instanceof model.Unit) {
        throw new Error("IllegalArgumentType");
    }

    property.points -= model.Property.CAPTURE_STEP;
    if (property.points <= 0) {
        property.owner = unit.owner;
        property.points = model.Property.CAPTURE_POINTS;
        // TODO: if max points are static then the configurable points from the property sheets can be removed

        // was captured
        return true;
    }

    // was not captured
    return false;
};

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

// --------------------------------------------------------------------------------------------------------


// Signal for units that cannot attack.
//
exports.FIRETYPE_NONE = 0;

// Indirect fire type that can fire from range 2 to x.
//
exports.FIRETYPE_INDIRECT = 1;

// Direct fire type that can fire from range 1 to 1.
//
exports.FIRETYPE_DIRECT = 2;

// Ballistic fire type that can fire from range 1 to x.
//
exports.FIRETYPE_BALLISTIC = 3;

exports.ATTACKABLE = 1;

exports.MOVE_AND_ATTACKABLE = 2;

exports.MOVABLE = 3;

//
// Returns true if the **unit** has a main weapon, else false.
//
exports.hasMainWeapon = function (unit) {
    var attack = unit.type.attack;
    return (attack && attack.main_wp);
};

//
// Returns true if the **unit** has a secondary weapon, else false.
//
exports.hasSecondaryWeapon = function (unit) {
    var attack = unit.type.attack;
    return (attack && attack.sec_wp);
};

// Returns **true** if a given **unit** is an direct unit else **false**.
//
exports.isDirect = function (unit) {
    return exports.getFireType(unit) === this.FIRETYPE_DIRECT;
};

// Returns **true** if a given **unit** is an indirect unit ( *e.g. artillery* ) else **false**.
//
exports.isIndirect = function (unit) {
    return exports.getFireType(unit) === this.FIRETYPE_INDIRECT;
};

// Returns **true** if a given **unit** is an ballistic unit ( *e.g. anti-tank-gun* ) else **false**.
//
exports.isBallistic = function (unit) {
    return exports.getFireType(unit) === this.FIRETYPE_BALLISTIC;
};

// Returns the fire type of a given **unit**.
//
exports.getFireType = function (unit) {
    if (!exports.hasMainWeapon(unit) && !exports.hasSecondaryWeapon(unit)) {
        return exports.FIRETYPE_NONE;
    }

    // The fire type will be determined by the following situations. All other situations (which aren't in the
    // following table) aren't allowed due the game rules.
    //
    // Min-Range === 1 --> Ballistic
    // Min-Range   > 1 --> Indirect
    // No Min-Range    --> Direct
    // Only Secondary  --> Direct
    //

    var min = unit.type.attack.minrange;
    if (!min) {
        return exports.FIRETYPE_DIRECT;

    } else {
        // non-direct units aren't allowed to obtain secondary weapons
        if (constants.DEBUG) assert(exports.hasMainWeapon(unit), "found non-direct unit with secondary weapon");

        return (min > 1 ? exports.FIRETYPE_INDIRECT : exports.FIRETYPE_BALLISTIC);
    }
};

//
// Returns **true** if an **attacker** can use it's main weapon against a **defender**. The distance will not
// checked in case of an indirect attacker.
//
exports.canUseMainWeapon = function (attacker, defender) {
    var attack = attacker.type.attack;
    if (attack.main_wp && this.ammo > 0) {
        var v = attack.main_wp[defender.type.ID];

        if (v && v > 0) {
            return true;
        }
    }

    return false;
};

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