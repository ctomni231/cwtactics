"use strict";

var constants = require("./constants");
var storage = require("./storage");
var config = require("./config");
var system = require("./tility");
var debug = require("./debug");
var image = require("./image");
var input = require("./input");
var audio = require("./audio");

/** */
var IMAGE_KEY = "GFX_";

/** */
var KEY_MODIFICATION = "__modification__";

/** */
var PARAM_WIPE_OUT = "resetData";

/** */
var PARAM_FORCE_TOUCH = "forceTouch";

/** */
var PARAM_ANIMATED_TILES = "animatedTiles";


var loadParameter = function (paramName, callback) {
    storage.get(paramName, function (obj) {
        var value;

        if (obj) {
            config.getConfig(paramName).setValue(obj.value ? 1 : 0);

        } else {
            var param = utility.getURLQueryParams(document.location.search)[paramName];
            if (typeof param !== "undefined") value = (param === "1" ? 1 : 0);
        }

        if (typeof value !== "undefined") config.getConfig(paramName).setValue(value);

        if (callback) callback();
    });
};

exports.wantResetData = function () {
    return (utility.getURLQueryParams(document.location.search)[PARAM_WIPE_OUT] === "1");
};

exports.saveGameConfig = function (callback) {
    storage.set(PARAM_FORCE_TOUCH, (config.getValue(PARAM_FORCE_TOUCH) === 1), function () {
        storage.set(PARAM_ANIMATED_TILES, (config.getValue(PARAM_ANIMATED_TILES) === 1), function () {
            if (callback) callback();
        });
    });
};

exports.loadGameConfig = function (callback) {
    loadParameter(PARAM_FORCE_TOUCH, function () {
        loadParameter(PARAM_ANIMATED_TILES, callback);
    });
};

exports.transferGameModFromRemote = function (callback) {
    var path = constants.DEFAULT_MOD_PATH;

    utility.doHttpRequest({
        path: path,
        json: true,

        success: function (response) {
            cachedMod = response;

            // TODO validate modification object

            storage.set(KEY_MODIFICATION, response, callback);
        },

        error: function () {
            throw Error("failed to loadGameConfig mod");
        }
    });
};

exports.transferGameModFromCache = function (callback) {
    storage.get(KEY_MODIFICATION, function (value) {
        cachedMod = value;
        callback();
    });
};

exports.getMod = function () {
    return cachedMod;
};

exports.clearCachedMod = function () {
    cachedMod = null;
};


/**
 * Saves the current active input mapping into the user storage.
 */
exports.saveKeyMapping = function () {
    storage.set(
        MAPPING_STORAGE_KEY,

        // extract custom mapping
        {
            keyboard: input.KEYBOARD_MAPPING,
            gamePad: input.GAMEPAD_MAPPING
        },

        function() {
            debug.logInfo("successfully saved user input mapping");
        }
    );
};

/**
 * Loads the keyboard input mapping from the user storage. If no user input setting will be found then
 * the default mapping will be used.
 *
 * @param cb
 */
exports.loadKeyMapping = function (cb) {
    storage.get(
        MAPPING_STORAGE_KEY,

        function(obj) {
            if (obj && obj.value) {
                debug.logInfo("loading custom key configuration");

                // inject custom mapping
                if (obj.value.keyboard) input.KEYBOARD_MAPPING = obj.value.keyboard;
                if (obj.value.gamePad) input.GAMEPAD_MAPPING = obj.value.gamePad;
            }

            if (cb) cb(obj !== null);
        }
    );
};

"use strict";

var constants = require("../constants");
var storage = require("../storage");
var config = require("../config");
var sheets = require("../sheets");
var model = require("../model");

var assert = require("../system/functions").assert;

exports.saveGameConfig = function (name, cb) {
    var saveData = {};

    saveData.mpw = model.mapWidth;
    saveData.mph = model.mapHeight;
    saveData.map = [];
    saveData.prps = [];
    saveData.units = [];

    // generates ID map
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for (var x = 0, xe = model.mapWidth; x < xe; x++) {

        saveData.map[x] = [];
        for (var y = 0, ye = model.mapHeight; y < ye; y++) {
            var type = model.mapData[x][y].type.ID;

            // create number for type
            if (!mostIdsMap.hasOwnProperty(type)) {
                mostIdsMap[type] = mostIdsMapCurIndex;
                mostIdsMapCurIndex++;
            }

            saveData.map[x][y] = mostIdsMap[type];

            // saveGameConfig property
            var prop = model.mapData[x][y].property;
            if (prop) {
                saveData.prps.push([
                    model.properties.indexOf(prop),
                    x,
                    y,
                    prop.type.ID,
                    prop.capturePoints,
                    prop.owner.id
                ]);
            }

            // saveGameConfig unit
            var unit = model.mapData[x][y].unit;
            if (unit) {
                saveData.units.push([
                    model.units.indexOf(unit),
                    unit.type.ID,
                    x,
                    y,
                    unit.hp,
                    unit.ammo,
                    unit.fuel,
                    unit.loadedIn,
                    unit.owner.id,
                    unit.canAct,
                    unit.hidden
                ]);
            }
        }
    }

    // generate type map
    saveData.typeMap = [];
    var typeKeys = Object.keys(mostIdsMap);
    for (var i = 0, e = typeKeys.length; i < e; i++) {
        saveData.typeMap[mostIdsMap[typeKeys[i]]] = typeKeys[i];
    }

    saveData.wth = model.weather.ID;
    saveData.day = model.day;
    saveData.trOw = model.turnOwner.id;
    saveData.gmTm = model.gameTimeElapsed;
    saveData.tnTm = model.turnTimeElapsed;

    saveData.cfg = {};
    for (var i = 0, e = config.gameConfigNames.length; i < e; i++) {
        var key = config.gameConfigNames[i];
        saveData.cfg[key] = config.Config.getValue(key);
    }

    storage.set("SAVE_"+name, JSON.stringify(saveData), cb);
};

