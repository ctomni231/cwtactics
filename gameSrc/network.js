"use strict";

var debug = require("./debug");
var constants = require("./constants");

// Id of the game in the connected network session.
var gameId = null;

// Id of the client in the connected network session.
var clientId = constants.INACTIVE;

/** */
exports.isActive = function () {
    return gameId !== null;
};

/** */
exports.isHost = function () {
    return gameId === null || clientId !== constants.INACTIVE;
};

/** Parses a message and invokes commands if necessary. */
exports.parseMessage = function (msg) {
    debug.logCritical("NotImplementedYetException");
};

/** Sends a given action data object into data object and sends it to the game server. */
exports.sendMessage = function (actionData) {
    debug.logCritical("NotImplementedYetException");
};