"use strict";

var BUFFER_SIZE = 200;

var circularBuffer = require("./circularBuffer");
var constants = require("./constants");
var emptyFn = require("./functions").emptyFunction;
var network = require("./network");
var assert = require("./functions").assert;

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
    this.condition = (impl.condition) ? impl.condition : emptyFn;
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
    return "ActionData:: "+exports.ActionData.serializeActionData(this);
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
var actions = {};

var createAction = function (key, type, impl) {
  impl.key = key;
  impl.type = type;
  actions[key] = new exports.Action(impl);
};

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
  if (constants.DEBUG) console.log(data);

  // TODO invoke it


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