/**
 * Module that holds all object actions.
 *
 * @module
 */

"use strict";

var circularBuffer = require("./system/circularBuffer");
var constants = require("./constants");
var network = require("./network");
var debug = require("./debug");
var func = require("./system/functions");

var BUFFER_SIZE = 200;

// Pool for holding ActionData objects when they aren't in the buffer.
var pool = circularBuffer.createBufferByClass(exports.ActionData, BUFFER_SIZE);

// Buffer object.
var buffer = new circularBuffer.CircularBuffer(BUFFER_SIZE);

// List of all available actions.
var actions = [];

// Action -> ActionID<numeric> mapping
var actionIds = {};

/**
 * Map actions are called in the idle state on the map.
 */
exports.MAP_ACTION = 0;

/**
 * Unit actions are called on units.
 */
exports.UNIT_ACTION = 1;

/**
 * Property actions are called on properties.
 */
exports.PROPERTY_ACTION = 2;

/**
 * Engine actions are callable by the engine itself.
 */
exports.ENGINE_ACTION = 3;

/**
 * Client actions are callable only by the game session hoster.
 */
exports.CLIENT_ACTION = 4;

exports.SET_POSITION = 0;
exports.PREVENT_CLEAR_OLD_POS = 1;
exports.PREVENT_SET_NEW_POS = 2;

/**
 * Action class which represents an action which is usable by engine objects.
 *
 * @class
 */
exports.Action = function (impl) {

    /**
     * Key ID of the action.
     */
    this.key = impl.key;

    this.positionUpdateMode = (impl.positionUpdateMode || exports.SET_POSITION);

    /**
     * Type of the action.
     */
    this.type = impl.type;

    // ?
    this.action = impl.action;

    /**
     * Condition function which checks the availability of the action with the current
     * state data.
     */
    this.condition = impl.condition || func.trueReturner;

    /**
     * Prepares the menu for a given state data.
     */
    this.prepareMenu = impl.prepareMenu || null;

    /**
     * Checks the correctness of a given target position.
     */
    this.isTargetValid = impl.isTargetValid || null;

    /**
     * Adds all possible targets into the state selection.
     */
    this.prepareTargets = impl.prepareTargets || null;

    /**
     * Marks the kind of the action. Multistep actions can flush more than one command into
     * the command stack.
     */
    this.multiStepAction = impl.multiStepAction || null;

    /**
     * Prepares the selection.
     */
    this.prepareSelection = impl.prepareSelection || null;

    /**
     * Marks the target selection mode. Mode 'A' will be done before the sub menu. Mode 'B'
     * will be done after the sub menu.
     */
    this.targetSelectionType = impl.targetSelectionType || "A";

    /**
     * If true, then flusher won't push a 'wait' command. This is only usable for unit actions.
     */
    this.noAutoWait = impl.noAutoWait || false;

    /**
     * Shows the needed unit to unit relation mode.
     */
    this.relation = impl.relation || null;

    /**
     * Shows the needed unit to property relation mode.
     */
    this.relationToProp = impl.relationToProp || null;

    if (!impl.invoke) {
        throw new Error("IllegalImplementationException: action invoke function is missing");
    }

    /**
     * Invokes the action with a given set of arguments.
     */
    this.invoke = impl.invoke;
};

/**
 * @class
 */
exports.ActionData = function () {
    this.reset();
};

/**
 * Converts an action data object to JSON.
 */
exports.ActionData.serializeActionData = function (data) {
    return JSON.stringify([data.id, data.p1, data.p2, data.p3, data.p4, data.p5]);
};

/**
 * Converts a JSON string to an action data object.
 */
exports.ActionData.deSerializeActionData = function (data) {
    if (typeof data === "string") {
        data = JSON.stringify(data);
    }

    var actData = pool.pop();
    actData.id = data[0];
    actData.p1 = data[1];
    actData.p2 = data[2];
    actData.p3 = data[3];
    actData.p4 = data[4];
    actData.p5 = data[5];

    return actData;
};

/**
 * Resets the data of the data object.
 */
exports.ActionData.prototype.reset = function () {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
};

/**
 * @override
 */
exports.ActionData.prototype.toString = function () {
    return exports.ActionData.serializeActionData(this);
};

/**
 *
 * @param key
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @param p5
 * @param asHead the action will be inserted as head (called as next command) if true,
 *               else as tail (called at last)
 */
var localAction = function (key, p1, p2, p3, p4, p5, asHead) {
    if (arguments.length > 6) {
        throw new Error("IllegalNumberOfArgumentsException");
    }

    var actionData = pool.popLast();

    // insert data into the action object
    actionData.id = exports.getActionId(key);
    actionData.p1 = p1 !== undefined ? p1 : constants.INACTIVE;
    actionData.p2 = p2 !== undefined ? p2 : constants.INACTIVE;
    actionData.p3 = p3 !== undefined ? p3 : constants.INACTIVE;
    actionData.p4 = p4 !== undefined ? p4 : constants.INACTIVE;
    actionData.p5 = p5 !== undefined ? p5 : constants.INACTIVE;

    debug.logInfo("append action " + actionData + " as " + (asHead ? "head" : "tail") + " into the stack");

    if (asHead) {
        buffer.pushInFront(actionData);
    } else {
        buffer.push(actionData);
    }
};

/**
 * Adds the action with a given set of arguments to the action stack.
 *
 * Every parameter of the call will be submitted beginning from index 1 of the
 * arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
 * Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
 * a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
 */
exports.localAction = function (key, p1, p2, p3, p4, p5) {
    localAction(key, p1, p2, p3, p4, p5, false);
};

exports.localActionLIFO = function (key, p1, p2, p3, p4, p5) {
    localAction(key, p1, p2, p3, p4, p5, true);
};

/**
 * Adds the action with a given set of arguments to the action stack and
 * shares the the call with all other clients.
 */
exports.sharedAction = function () {
    if (network.isActive()) {
        network.sendMessage(JSON.stringify(Array.prototype.slice.call(arguments)));
    }

    exports.localAction.apply(null, arguments);
};

/**
 * Parses an action message and pushes it into the command stack.
 */
exports.parseActionMessage = function (msg) {
    var data = JSON.parse(msg);

    if (!Array.isArray(data) || !data.length) {
        throw new Error("IllegalActionFormatException");
    }

    exports.localAction.apply(null, data);
};

/**
 * Returns a list of all registered actions.
 */
exports.getActions = function () {
    return actions;
};

/**
 * Returns the action which has the given key ID.
 */
exports.getAction = function (key) {
    return actions[actionIds[key]];
};

/**
 * Gets the numeric ID of an action object.
 */
exports.getActionId = function (key) {
    return actionIds[key];
};

/**
 * Resets the buffer object.
 */
exports.resetData = function () {
    while (exports.hasData()) {
        pool.push(buffer.pop());
    }
};

/**
 * Returns true when the buffer has elements else false.
 */
exports.hasData = function () {
    return !buffer.isEmpty();
};

/**
 * Invokes the next command in the command stack. Throws an error when the command stack
 * is empty.
 */
exports.invokeNext = function () {
    var data = buffer.popFirst();

    if (!data) {
        throw new Error("NullPointerException");
    }

    var actionObj = actions[data.id];

    debug.logInfo("evaluating action data object " + data + "(" + actionObj.key + ")");

    actionObj.invoke(data.p1, data.p2, data.p3, data.p4, data.p5);

    // cache used object
    data.reset();
    pool.push(data);
};

// register all game actions

var createAction = function (key, type, impl) {
    impl.key = key;
    impl.type = type;
    actions.push(new exports.Action(impl));
    actionIds[key] = actions.length - 1;
};

// register some actions here

createAction("transferUnit", exports.UNIT_ACTION, require("./actions/transfer").actionUnit);
createAction("unitUnhide", exports.UNIT_ACTION, require("./actions/stealth").actionUnhide);
createAction("unitHide", exports.UNIT_ACTION, require("./actions/stealth").actionHide);
createAction("supplyUnit", exports.UNIT_ACTION, require("./actions/supply").action);
createAction("capture", exports.UNIT_ACTION, require("./actions/capture").action);
createAction("explode", exports.UNIT_ACTION, require("./actions/explode").action);
createAction("joinUnits", exports.UNIT_ACTION, require("./actions/join").action);
createAction("attack", exports.UNIT_ACTION, require("./actions/attack").action);
createAction("wait", exports.UNIT_ACTION, require("./actions/wait").action);
createAction("unloadUnit", exports.UNIT_ACTION, require("./actions/transport").actionUnload);
createAction("loadUnit", exports.UNIT_ACTION, require("./actions/transport").actionLoad);

createAction("activatePower", exports.MAP_ACTION, require("./actions/commander").actionActivate);
createAction("transferMoney", exports.MAP_ACTION, require("./actions/transfer").actionMoney);
createAction("nextTurn", exports.MAP_ACTION, require("./actions/nextTurn").action);
createAction("options", exports.MAP_ACTION, require("./actions/options").action);

createAction("transferProperty", exports.PROPERTY_ACTION, require("./actions/transfer").actionProperty);
createAction("buildUnit", exports.PROPERTY_ACTION, require("./actions/factory").action);

createAction("changeWeather", exports.ENGINE_ACTION, require("./actions/weather").exports.changeWeatherAction);
createAction("moveStart", exports.ENGINE_ACTION, require("./actions/move").actionStart);
createAction("moveAppend", exports.ENGINE_ACTION, require("./actions/move").actionAppend);
createAction("moveEnd", exports.ENGINE_ACTION, require("./actions/move").actionEnd);

createAction("refillSupply", exports.ENGINE_ACTION, require("./actions/supply").actionRefillSupply);
createAction("healUnit", exports.ENGINE_ACTION, require("./actions/supply").actionHealUnit);
