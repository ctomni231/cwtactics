"use strict";

/**
 * Loader module which allows to loadGameConfig all game data.
 *
 * @module
 */

var dataTransfer = require("./dataTransfer");
var localization = require("./localization");
var constants = require("./constants");
var actions = require("./actions");
var storage = require("./storage");
var system = require("./utility");
var sheets = require("./sheets");
var image = require("./image");
var input = require("./input");
var debug = require("./debug");

var PARAM_HAS_CACHE = "__hasCache__";
var CONFIRM_MSG = "Your system isn't supported by CW:T. Try to run it?";

/** Marks the existence of game data in the browser storage. */
var hasCachedData = false;

/**
 * Starts the loading process. After the loading process the loading stuff will be removed.
 * The Loading namespace will remain with a property with value true as marker. This
 * property will be named deInitialized.
 *
 * @param setProcess
 * @param callback
 */
exports.startProcess = function (setProcess, callback) {

    /** @inner */
    function setProgress(i) {
        return function (next) {
            setProcess(i);
            next();
        };
    }

    debug.logInfo("start loading game data");
    storage.get(PARAM_HAS_CACHE, function (value) {
        hasCachedData = value;
        utility.sequence([

                function (next) {
                    debug.logInfo("checking system");

                    // ask question when system is not supported
                    if (require("../system/features").supported || confirm(CONFIRM_MSG)) {
                        next();
                    }
                },

                setProgress(5),

                function (nextLoadingStep) {
                    debug.logInfo("checking options");

                    utility.sequence([
                        function (next) {
                            if (dataTransfer.wantResetData()) {
                                debug.logInfo("wipe out cached data");

                                storage.clear(function () {
                                    document.location.reload();
                                });

                            } else {
                                next();
                            }
                        },

                        dataTransfer.loadGameConfig,

                        function (next) {
                            var cfg = require("../config").getConfig("forceTouch");
                            if (cfg.value === 1) {

                                // enable touch and disable mouse ( cannot work together )
                                features.mouse = false;
                                features.touch = true;
                            }

                            next();
                        }

                    ], function () {
                        nextLoadingStep();
                    });
                },

                setProgress(10),

                function (next, hasCachedData) {
                    debug.logInfo("loading modification");

                    if (!hasCachedData) {
                        dataTransfer.transferGameModFromRemote(constants.DEFAULT_MOD_PATH, next);

                    } else {
                        dataTransfer.transferGameModFromCache(next);
                    }
                },

                setProgress(15),

                function (next) {
                    var mod = dataTransfer.getMod();

                    image.minimapIndex = mod.minimapIndex;

                    mod.movetypes.forEach(function (movetype) {
                        sheets.registerSheet(sheets.TYPE_MOVETYPE, movetype);
                    });

                    mod.commanders.forEach(function (commander) {
                        sheets.registerSheet(sheets.TYPE_COMMANDER, commander);
                    });

                    mod.properties.forEach(function (property) {
                        sheets.registerSheet(sheets.TYPE_PROPERTY, property);
                    });

                    mod.weathers.forEach(function (weather) {
                        sheets.registerSheet(sheets.TYPE_WEATHER, weather);
                    });

                    mod.units.forEach(function (unit) {
                        sheets.registerSheet(sheets.TYPE_UNIT, unit);
                    });

                    mod.tiles.forEach(function (tile) {
                        sheets.registerSheet(sheets.TYPE_TILE, tile);
                    });

                    next();
                },

                setProgress(20),

                function (next) {
                    debug.logInfo("language selection");

                    var mod = modDTO.getMod();
                    var langList = Object.keys(mod.languages);
                    langList.forEach(function (lang) {
                        localization.registerLanguage(lang, mod.languages[lang]);
                    });

                    // todo: recognize custom user selected language

                    var language = window.navigator.userLanguage || window.navigator.language;
                    var key;

                    switch (language) {

                        // german ?
                        case "de":
                        case "de-de":
                        case "de-De":
                        case "german":
                        case "Deutsch":
                            key = "de";
                            break;

                        // fallback: english
                        default:
                            key = "en";
                            break;
                    }

                    localization.selectLanguage(key);

                    next();
                },

                setProgress(25),

                function (loaderNext, hasCachedData) {
                    debug.logInfo("loading image data");

                    if (hasCachedData) {
                        dataTransfer.transferAllImagesFromStorage(loaderNext);

                    } else {
                        dataTransfer.transferAllImagesFromRemote(function () {
                            dataTransfer.transferAllImagesToStorage(loaderNext);
                        });
                    }
                },

                setProgress(50),

                function (next, hasCachedData) {
                    debug.logInfo("initializing audio system");

                    // don't loadGameConfig audio when disabled
                    if (features.audioMusic || features.audioSFX) {
                        var assetLoader = hasCachedData ?
                            dataTransfer.transferAudioFromStorage : dataTransfer.transferAudioFromRemote;

                        // 1. loadGameConfig assets
                        assetLoader(function () {

                            // 2. loadGameConfig volume configuration
                            dataTransfer.loadVolumeConfigs(next);
                        });

                    } else {
                        next();
                    }
                },

                setProgress(75),

                function (next) {
                    debug.logInfo("initializing input system");

                    if (features.keyboard) input.keyboardBackend.enable();
                    if (features.gamePad) input.gamepadBackend.enable();
                    if (features.mouse) input.mouseBackend.enable();
                    if (features.touch) input.touchBackend.enable();

                    inpMapping.loadGameConfig(next);
                },

                setProgress(80),

                function (next, hasCachedData) {
                    debug.logInfo("loading maps");
                    dataTransfer[hasCachedData? "transferAllMapsFromStorage" : "transferAllMapsFromRemote"](next);
                },

                setProgress(85),

                function (next) {
                    if (typeof window.orientation !== 'undefined') {
                        var doOnOrientationChange = function() {
                            switch (window.orientation) {
                                case -90:
                                case 90:
                                    console.log('landscape');
                                    break;

                                default:
                                    console.log('portrait');
                                    break;
                            }
                        };

                        window.addEventListener('orientationchange', doOnOrientationChange);
                        doOnOrientationChange();
                    }
                    next();
                },

                setProgress(90),

                // TODO needed?
                function (next) {
                    debug.logInfo("initialising action system");

                    actions.createAction("transferUnit", exports.UNIT_ACTION, require("./actions/transfer").actionUnit);
                    actions.createAction("unitUnhide", exports.UNIT_ACTION, require("./actions/stealth").actionUnhide);
                    actions.createAction("unitHide", exports.UNIT_ACTION, require("./actions/stealth").actionHide);
                    actions.createAction("supplyUnit", exports.UNIT_ACTION, require("./actions/supply").action);
                    actions.createAction("capture", exports.UNIT_ACTION, require("./actions/capture").action);
                    actions.createAction("explode", exports.UNIT_ACTION, require("./actions/explode").action);
                    actions.createAction("joinUnits", exports.UNIT_ACTION, require("./actions/join").action);
                    actions.createAction("attack", exports.UNIT_ACTION, require("./actions/attack").action);
                    actions.createAction("wait", exports.UNIT_ACTION, require("./actions/wait").action);
                    actions.createAction("unloadUnit", exports.UNIT_ACTION, require("./actions/transport").actionUnload);
                    actions.createAction("loadUnit", exports.UNIT_ACTION, require("./actions/transport").actionLoad);

                    actions.createAction("activatePower", exports.MAP_ACTION, require("./actions/commander").actionActivate);
                    actions.createAction("transferMoney", exports.MAP_ACTION, require("./actions/transfer").actionMoney);
                    actions.createAction("nextTurn", exports.MAP_ACTION, require("./actions/nextTurn").action);
                    actions.createAction("options", exports.MAP_ACTION, require("./actions/options").action);

                    actions.createAction("transferProperty", exports.PROPERTY_ACTION, require("./actions/transfer").actionProperty);
                    actions.createAction("buildUnit", exports.PROPERTY_ACTION, require("./actions/factory").action);

                    actions.createAction("changeWeather", exports.ENGINE_ACTION, require("./actions/weather").changeWeatherAction);
                    actions.createAction("moveStart", exports.ENGINE_ACTION, require("./actions/move").actionStart);
                    actions.createAction("moveAppend", exports.ENGINE_ACTION, require("./actions/move").actionAppend);
                    actions.createAction("moveEnd", exports.ENGINE_ACTION, require("./actions/move").actionEnd);
                    actions.createAction("refillSupply", exports.ENGINE_ACTION, require("./actions/supply").actionRefillSupply);
                    actions.createAction("healUnit", exports.ENGINE_ACTION, require("./actions/supply").actionHealUnit);

                    next();
                },

                setProgress(95),

                // TODO needed?
                function (next) {
                    debug.logInfo("initialising state machine");

                    addState(require("./states/start_tooltip").state);
                    addState(require("./states/portrait").state);
                    addState(require("./states/error").state);

                    addMenuState(require("./states/menu_main").state);

                    addMenuState(require("./states/options_remap").state);
                    addMenuState(require("./states/options_confirmWipeOut").state);
                    addMenuState(require("./states/options_main").state);

                    addState(require("./test/rain").state);
                    addState(require("./test/weather").state);

                    addMenuState(require("./states/menu_versus").state);
                    addMenuState(require("./states/menu_playerSetup").state);
                    addMenuState(require("./states/menu_parameterSetup").state);

                    addInGameState(require("./states/ingame_enter").state);
                    addInGameState(require("./states/ingame_idle").state);
                    addInGameState(require("./states/ingame_leave").state);
                    addInGameState(require("./states/ingame_movepath").state);
                    addInGameState(require("./states/ingame_menu").state);
                    addInGameState(require("./states/ingame_showAttackRange").state);

                    addInGameState(require("./states/ingame_flush").state);

                    addInGameState(require("./states/ingame_multistep").state);
                    addInGameState(require("./states/ingame_selecttile").state);
                    addInGameState(require("./states/ingame_submenu").state);
                    addInGameState(require("./states/ingame_targetselection_a").state);
                    addInGameState(require("./states/ingame_targetselection_b").state);

                    addAnimationState(require("./states/ingame_anim_move").state);
                    addAnimationState(require("./states/ingame_anim_siloFire").state);
                    addAnimationState(require("./states/ingame_anim_captureProperty").state);
                    addAnimationState(require("./states/ingame_anim_changeWeather").state);
                    addAnimationState(require("./states/ingame_anim_destroyUnit").state);
                    addAnimationState(require("./states/ingame_anim_nextTurn").state);
                    addAnimationState(require("./states/ingame_anim_trapWait").state);

                    next();
                },

                setProgress(100),

                function (next) {
                    dataTransfer.clearCachedMod();
                    next();
                }
            ],
            function () {
                if (callback) {
                    debug.logInfo("finished loading game data");
                    storage.set(PARAM_HAS_CACHE, true, callback);
                }
            }
        );
    });
};