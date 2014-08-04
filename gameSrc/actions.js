"use strict";

var CircularBuffer = require("./circularBuffer").CircularBuffer;
var assert = require("./functions").assert;
var constants = require("./constants");
var network = require("./network");

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
    this.type = impl.type;
    this.action = impl.action;
    this.condition = (impl.condition) ? impl.condition : cwt.emptyFunction;
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
  }
});

//
//
exports.ActionDataClass = my.Class({
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
    return "ActionData::[id:" + this.id + " p1:" + this.p1 + " p2:" + this.p2 + " p3:" + this.p3 + " p4:" + this.p4 +
      " p5:" + this.p5 + "]";
  }
});

//
// Converts an action data object to JSON.
//
// @param {cwt.ActionData} data
// @return {string}
//
exports.serializeActionData = function (data) {
  return JSON.stringify([data.id, data.p1, data.p2, data.p3, data.p4, data.p5]);
};

// Converts a JSON string to an action data object.
//
exports.deSerializeActionData = function (data) {
  if (typeof data === "string") {
    data = JSON.stringify(data)
  }

  var actData = null; // TODO grab it from pool
  actData.id = data[0];
  actData.p1 = data[1];
  actData.p2 = data[2];
  actData.p3 = data[3];
  actData.p4 = data[4];
  actData.p5 = data[5];
};

// Pool for holding {cwt.ActionData} objects when they aren't in the buffer.
//
exports.actionDataPool = new CircularBuffer(200);

// Buffer object.
//
exports.buffer = new CircularBuffer(200);

//
// List of all available actions.
//
var actions = {};

var createAction = function (key, type, impl) {
  impl.key = key;
  impl.type = type;
  actions[key] = new exports.Action(impl);
};

// register all game actions
createAction("wait",exports.UNIT_ACTION,require("./actions/wait").action);
createAction("changeWeather",exports.ENGINE_ACTION,require("./actions/weather").action);
createAction("loadUnit",exports.ENGINE_ACTION,require("./actions/transport").actionLoad);
createAction("unloadUnit",exports.ENGINE_ACTION,require("./actions/transport").actionUnload);
createAction("transferMoney",exports.MAP_ACTION,require("./actions/transfer").actionMoney);
createAction("transferUnit",exports.UNIT_ACTION,require("./actions/transfer").actionUnit);
createAction("transferProperty",exports.PROPERTY_ACTION,require("./actions/transfer").actionProperty);
createAction("supplyUnit",exports.UNIT_ACTION,require("./actions/supply").action);
createAction("unitHide",exports.UNIT_ACTION,require("./actions/stealth").actionHide);
createAction("unitUnhide",exports.UNIT_ACTION,require("./actions/stealth").actionUnhide);
createAction("options",exports.MAP_ACTION,require("./actions/options").action);
createAction("buildUnit",exports.PROPERTY_ACTION,require("./actions/factory").action);
createAction("joinUnits",exports.UNIT_ACTION,require("./actions/join").action);
createAction("capture",exports.UNIT_ACTION,require("./actions/capture").action);
createAction("activatePower",exports.MAP_ACTION,require("./actions/commander").actionActivate);
createAction("explode",exports.UNIT_ACTION,require("./actions/explode").action);
createAction("nextTurn",exports.MAP_ACTION,require("./actions/nextTurn").action);
createAction("moveStart",exports.ENGINE_ACTION,require("./actions/move").actionStart);
createAction("moveEnd",exports.ENGINE_ACTION,require("./actions/move").actionEnd);
createAction("attack",exports.UNIT_ACTION,require("./actions/attack").action);

//
// @return {Array}
//
exports.getActionNames = function () {
  return Object.keys(actions);
};

//
// Resets the buffer object.
//
exports.resetData = function () {
  while (this.hasData()) {
    this.actionDataPool.push(this.buffer.pop());
  }
};

//
// Returns true when the buffer has elements else false.
//
exports.hasData = function () {
  return !this.buffer.isEmpty();
};

//
//
exports.invokeNext = function () {
  var data = this.buffer.popFirst();

  if (constants.DEBUG) assert(data);
  if (constants.DEBUG) console.log(data);

  // TODO invoke it


  // pool used object
  data.reset();
  this.actionDataPool.push(data);
};

// Adds a command to the command pool. Every parameter of the call will be submitted beginning from index 1 of the
// arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
// Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
// a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
//
exports.pushCommand = function (local, id, num1, num2, num3, num4, num5) {
  var data = this.actionDataPool.pop();

  // inject data
  data.id = id;
  data.p1 = num1;
  data.p2 = num2;
  data.p3 = num3;
  data.p4 = num4;
  data.p5 = num5;

  // send command over network
  if (!local && network.isActive()) {
    network.sendMessage(exports.serializeActionData(data));
  }

  this.buffer.push(data);
};