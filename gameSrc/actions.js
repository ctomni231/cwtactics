"use strict";

var BUFFER_SIZE = 200;

var circularBuffer = require("./system/circularBuffer");
var constants = require("./constants");
var func = require("./system/functions");
var network = require("./network");
var assert = require("./system/functions").assert;

// Map actions are called in the idle state on the map.
//
exports.MAP_ACTION = 0;

// Unit actions are called on units.
//
exports.UNIT_ACTION = 1;

// Property actions are called on properties.
//
exports.PROPERTY_ACTION = 2;

// Engine actions are callable by the engine itself.
//
exports.ENGINE_ACTION = 3;

//
//
exports.CLIENT_ACTION = 4;

//
// @class
//
exports.Action = my.Class({

  constructor: function (impl) {
    this.key = impl.key;
    this.type = impl.type;
    this.action = impl.action;
    this.condition = (impl.condition) ? impl.condition : func.trueReturner;
    this.prepareMenu = impl.prepareMenu || null;
    this.isTargetValid = impl.isTargetValid || null;
    this.prepareTargets = impl.prepareTargets || null;
    this.multiStepAction = impl.multiStepAction || null;
    this.prepareSelection = impl.prepareSelection || null;
    this.targetSelectionType = impl.targetSelectionType || "A";
    this.noAutoWait = impl.noAutoWait || false;
    this.relation = impl.relation || null;
    this.toDataBlock = impl.toDataBlock || null;
    this.parseDataBlock = impl.parseDataBlock || null;

    assert(impl.invoke);
    this.invoke = impl.invoke;
  }
});

//
//
exports.ActionData = my.Class({

  STATIC: {

    //
    // Converts an action data object to JSON.
    //
    // @param {cwt.ActionData} data
    // @return {string}
    //
    serializeActionData: function (data) {
      return JSON.stringify([data.id, data.p1, data.p2, data.p3, data.p4, data.p5]);
    },

    // Converts a JSON string to an action data object.
    //
    deSerializeActionData: function (data) {
      if (typeof data === "string") {
        data = JSON.stringify(data)
      }

      var actData = pool.pop();
      actData.id = data[0];
      actData.p1 = data[1];
      actData.p2 = data[2];
      actData.p3 = data[3];
      actData.p4 = data[4];
      actData.p5 = data[5];

      return actData;
    }
  },

  constructor: function () {
    this.reset();
  },

  //
  //
  //
  reset: function () {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  },

  toString: function () {
    return exports.ActionData.serializeActionData(this);
  }
});

// Pool for holding ActionData objects when they aren't in the buffer.
//
var pool = circularBuffer.createBufferByClass(exports.ActionData, BUFFER_SIZE);

// Buffer object.
//
var buffer = new circularBuffer.CircularBuffer(BUFFER_SIZE);

//
// List of all available actions.
//
var actions = [];

var actionIds = {};


// Adds the action with a given set of arguments to the action stack.
//
exports.localAction = function (key) {
  assert(arguments.length <= 6);

  // grab data object and fill it in relation to the given arguments
  var actionData = pool.popLast();
  actionData.id = exports.getActionId(key);
  if (arguments.length > 0) actionData.p1 = arguments[1];
  if (arguments.length > 1) actionData.p2 = arguments[2];
  if (arguments.length > 2) actionData.p3 = arguments[3];
  if (arguments.length > 3) actionData.p4 = arguments[4];
  if (arguments.length > 4) actionData.p5 = arguments[5];

  if (constants.DEBUG) console.log("add command " + actionData.toString() + " to the stack");

  // register action in the action stack
  buffer.push(actionData);
};

// Adds the action with a given set of arguments to the action stack and shares the
// the call with all other clients.
//
exports.sharedAction = function () {
  if (network.isActive()) {
    network.sendMessage(
      JSON.stringify(
        Array.prototype.slice.call(arguments)));
  }

  exports.localAction.apply(null, arguments);
};

exports.parseActionMessage = function (msg) {
  exports.localAction.apply(null, JSON.parse(msg));
};

//
// @return {Array}
//
exports.getActions = function () {
  return actions;
};

//
//
exports.getAction = function (key) {
  return actions[actionIds[key]];
};

//
//
exports.getActionId = function (key) {
  return actionIds[key];
};

//
// Resets the buffer object.
//
exports.resetData = function () {
  while (exports.hasData()) {
    pool.push(buffer.pop());
  }
};

//
// Returns true when the buffer has elements else false.
//
exports.hasData = function () {
  return !buffer.isEmpty();
};

//
//
exports.invokeNext = function () {
  var data = buffer.popFirst();

  if (constants.DEBUG) assert(data);
  if (constants.DEBUG) console.log("evaluating action data object " + data);

  var actionObj = actions[data.id];
  actionObj.invoke(data.p1, data.p2, data.p3, data.p4, data.p5);

  // pool used object
  data.reset();
  pool.push(data);
};

// Adds a command to the command pool. Every parameter of the call will be submitted beginning from index 1 of the
// arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
// Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
// a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
//
exports.pushCommand = function (local, id, num1, num2, num3, num4, num5) {
  var data = pool.pop();

  // inject data
  data.id = id;
  data.p1 = num1;
  data.p2 = num2;
  data.p3 = num3;
  data.p4 = num4;
  data.p5 = num5;

  // send command over network
  if (!local && network.isActive()) {
    network.sendMessage(exports.ActionData.serializeActionData(data));
  }

  buffer.push(data);
};

// register all game actions

var createAction = function (key, type, impl) {
  impl.key = key;
  impl.type = type;
  actions.push(new exports.Action(impl));
  actionIds[key] = actions.length - 1;
};

createAction("transferUnit", exports.UNIT_ACTION, require("./actions/transfer").actionUnit);
createAction("unitUnhide", exports.UNIT_ACTION, require("./actions/stealth").actionUnhide);
createAction("unitHide", exports.UNIT_ACTION, require("./actions/stealth").actionHide);
createAction("supplyUnit", exports.UNIT_ACTION, require("./actions/supply").action);
createAction("capture", exports.UNIT_ACTION, require("./actions/capture").action);
createAction("explode", exports.UNIT_ACTION, require("./actions/explode").action);
createAction("joinUnits", exports.UNIT_ACTION, require("./actions/join").action);
createAction("attack", exports.UNIT_ACTION, require("./actions/attack").action);
createAction("wait", exports.UNIT_ACTION, require("./actions/wait").action);

createAction("activatePower", exports.MAP_ACTION, require("./actions/commander").actionActivate);
createAction("transferMoney", exports.MAP_ACTION, require("./actions/transfer").actionMoney);
createAction("nextTurn", exports.MAP_ACTION, require("./actions/nextTurn").action);
createAction("options", exports.MAP_ACTION, require("./actions/options").action);

createAction("transferProperty", exports.PROPERTY_ACTION, require("./actions/transfer").actionProperty);
createAction("buildUnit", exports.PROPERTY_ACTION, require("./actions/factory").action);

createAction("unloadUnit", exports.ENGINE_ACTION, require("./actions/transport").actionUnload);
createAction("loadUnit", exports.ENGINE_ACTION, require("./actions/transport").actionLoad);
createAction("changeWeather", exports.ENGINE_ACTION, require("./actions/weather").action);
createAction("moveStart", exports.ENGINE_ACTION, require("./actions/move").actionStart);
createAction("moveEnd", exports.ENGINE_ACTION, require("./actions/move").actionEnd);