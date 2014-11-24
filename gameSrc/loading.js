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


/** Marks the existence of game data in the browser storage. */
var hasCachedData = false;

exports.startProcess = function (setProcess, callback) {

    /** @inner */
    function setProgress(i) {
        return function (next) {
            setProcess(i);
            next();
        };
    }

    storage.get(PARAM_HAS_CACHE, function (value) {
        hasCachedData = value;
        utility.sequence([


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