"use strict";

// Shared data that will be used between the states.
//

var model = require("../model");
var actions = require("../actions");
var renderer = require("../renderer");
var constants = require("../constants");
var stateMachine = require("../statemachine");
var circularBuffer = require("../system/circularBuffer");

var relationship = require("../logic/relationship");
var explode = require("../logic/exploder");
var move = require("../logic/move");
var co = require("../logic/co");

var invokeActionByData = function () {
  var p1 = constants.INACTIVE;
  var p2 = constants.INACTIVE;
  var p3 = constants.INACTIVE;
  var p4 = constants.INACTIVE;
  var p5 = constants.INACTIVE;
  var action = null;
  switch (action) {

    case "wait":
      p1 = exports.source.unitId;
      break;

    case "joinUnits":
      p1 = exports.source.unitId;
      p2 = exports.target.x;
      p3 = exports.target.y;
      break;

    case "supply":
      p1 = exports.target.x;
      p2 = exports.target.y;
      break;

    case "buildUnit":
      p1 = exports.target.propertyId;
      p2 = exports.action.selectedSubEntry;
      break;

    case "explode":
      p1 = exports.source.x;
      p2 = exports.source.y;
      p3 = explode.getSuicideRange(exports.source.unit);
      p4 = explode.getExplosionDamage(exports.source.unit);
      break;

    case "capture":
      p1 = exports.target.propertyId;
      p2 = exports.source.unitId;
      break;

    case "unloadUnit":
      p1 = exports.source.unitId;
      p2 = exports.target.x;
      p3 = exports.target.y;
      p4 = exports.action.selectedSubEntry;
      p5 = exports.targetselection.x;
      // data.targetselection.y
      break;

    case "loadUnit":
      p1 = exports.target.unitId;
      p2 = exports.source.unitId;
      break;

    case "transferUnit":
      p1 = exports.source.unitId;
      p2 = exports.selectedSubEntry;
      break;

    case "transferProperty":
      p1 = exports.source.propertyId;
      p2 = exports.selectedSubEntry;
      break;

    case "transferMoney":
      p1 = model.turnOwner.id;
      p2 = exports.target.property.owner.id;
      p3 = exports.selectedSubEntry;
      break;

    case "unitUnhide":
      p1 = exports.source.unitId;
      break;

    case "unitHide":
      p1 = exports.source.unitId;
      break;

    case "attack":
      p1 = exports.source.unitId;
      p2 = exports.targetselection.unitId;
      p3 = Math.round(Math.random() * 100);
      p4 = Math.round(Math.random() * 100);
      break;

    case "activatePower":
      p1 = (data.action.selectedSubEntry === "cop" ? co.POWER_LEVEL_COP :
        (data.action.selectedSubEntry === "scop" ? co.POWER_LEVEL_SCOP : -1));
      break;

    default:
      throw Error("unknown action");
  }

  actions.sharedAction(action, p1, p2, p3, p4, p5);
};

var checkConditionByData = function (action) {
  var conditionResult = true;

  switch (action.key) {

    case "wait":
      conditionResult = action.condition(exports.source.unit);
      break;

    case "explode":
      conditionResult = action.condition(exports.source.unit);
      break;

    case "joinUnits":
      conditionResult = action.condition(exports.source.unit, exports.target.unit);
      break;

    case "supply":
      conditionResult = action.condition(exports.target.unit, exports.target.x, exports.target.y);
      break;

    case "buildUnit":
      conditionResult = action.condition(exports.source.property);
      break;

    case "capture":
      conditionResult = action.condition(exports.source.unit, exports.target.property);
      break;

    case "unloadUnit":
      conditionResult = action.condition(exports.source.unit, exports.target.x, exports.target.y);
      break;

    case "loadUnit":
      conditionResult = action.condition(exports.target.unit, exports.source.unit);
      break;

    case "transferUnit":
      conditionResult = action.condition(exports.source.unit);
      break;

    case "transferProperty":
      conditionResult = action.condition(exports.source.property);
      break;

    case "transferMoney":
      conditionResult = action.condition(model.turnOwner, exports.target.x, exports.target.y);
      break;

    case "unitUnhide":
    case "unitHide":
      conditionResult = action.condition(exports.source.unit);
      break;

    case "attack":
      conditionResult = action.condition(
        exports.source.unit,
        exports.target.x, exports.target.y,
        exports.movePath.data[0] !== constants.INACTIVE
      );
      break;

    case "activatePower":
      conditionResult = action.condition(model.turnOwner);
      break;
  }

  return conditionResult;
};

var prepareTargetsByData = function (action) {
  switch (action.key) {
    case "unloadUnit":
      action.prepareTargets(
        exports.source.unitId,
        exports.target.x, exports.target.y,
        exports.action.selectedSubEntry,
        exports.selection
      );
      break;

    case "attack":
      action.prepareTargets(exports.source.unit, exports.target.x, exports.target.y, exports.selection);
      break;
  }
};

var prepareMenuByData = function (action) {
  switch (action.key) {
    case "buildUnit":
      action.prepareMenu(exports.source.property, exports.menu);
      break;

    case "unloadUnit":
      action.prepareMenu(exports.source.unit, exports.target.x, exports.target.y, exports.menu);
      break;

    case "transferUnit":
      action.prepareMenu(exports.source.unit.owner, exports.menu);
      break;

    case "transferProperty":
      action.prepareMenu(exports.source.property.owner, exports.menu);
      break;

    case "transferMoney":
      action.prepareMenu(model.turnOwner, exports.menu);
      break;

    case "activatePower":
      action.prepareMenu(model.turnOwner, exports.menu);
      break;
  }
};

//
// X coordinate of the cursor.
//
exports.cursorX = 0;

//
// Y coordinate of the cursor.
//
exports.cursorY = 0;

//
//
exports.fromIngameToOptions = false;

//
//
exports.inGameRound = true;

//
//
exports.multiStepActive = false;

//
// Position object with rich information about the selected position by an action and some relations.
//
exports.source = new model.PositionData();

// Position object with rich information about the selected position by an action and some relations.
//
exports.target = new model.PositionData();

// Position object with rich information about the selected position by an action and some relations.
//
exports.targetselection = new model.PositionData();

//
//
exports.movePath = new circularBuffer.CircularBuffer(constants.MAX_MOVE_LENGTH);

//
//
// @type {boolean}
//
exports.preventMovePathGeneration = false;

exports.inMultiStep = false;


//
//
//
exports.resetCursor = function () {
  exports.cursorX = 0;
  exports.cursorY = 0;
};

//
// Moves the cursor into a given direction.
//
// @param {number} dir
//
exports.moveCursor = function (dir) {
  var len = 1;
  var x = exports.cursorX;
  var y = exports.cursorY;

  switch (dir) {

    case move.MOVE_CODES_UP :
      y -= len;
      break;

    case move.MOVE_CODES_RIGHT :
      x += len;
      break;

    case move.MOVE_CODES_DOWN  :
      y += len;
      break;

    case move.MOVE_CODES_LEFT  :
      x -= len;
      break;
  }

  exports.setCursorPosition(x, y);
};

//
// Moves the cursor to a given position. The view will be moved as well with
// this function to make sure that the cursor is on the visible view.
//
exports.setCursorPosition = function (x, y, relativeToScreen) {
  if (relativeToScreen) {
    x = x + renderer.screenOffsetX;
    y = y + renderer.screenOffsetY;
  }

  // change illegal positions to prevent out of bounds
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= model.mapWidth) x = model.mapWidth - 1;
  if (y >= model.mapHeight) y = model.mapHeight - 1;

  if (x === exports.cursorX && y === exports.cursorY) {
    return;
  }

  renderer.eraseCursor(exports.cursorX, exports.cursorY);

  exports.cursorX = x;
  exports.cursorY = y;

  // convert to screen relative pos
  x = x - renderer.screenOffsetX;
  y = y - renderer.screenOffsetY;

  var moveCode = constants.INACTIVE;
  if (x <= 3) moveCode = move.MOVE_CODES_RIGHT;
  if (y <= 3) moveCode = move.MOVE_CODES_DOWN;
  if (x >= constants.SCREEN_WIDTH - 3) moveCode = move.MOVE_CODES_LEFT;
  if (y >= constants.SCREEN_HEIGHT - 3) moveCode = move.MOVE_CODES_UP;

  // do possible screen shift
  if (moveCode !== constants.INACTIVE) {
    if (renderer.shiftScreen(moveCode)) {
      renderer.shiftMap(moveCode);
    }
  }

  renderer.renderCursor(exports.cursorX, exports.cursorY);
};

//
//
exports.selection = {

  // @private */
  len_: constants.MAX_MOVE_LENGTH * 4,

  // @private */
  data_: null,

  // @private */
  centerX_: 0,

  // @private */
  centerY_: 0,

  // @override */
  getData: function () {
    return this.data_;
  },

  // @override */
  getCenterX: function () {
    return this.centerX_;
  },

  // @override */
  getCenterY: function () {
    return this.centerY_;
  },

  // @override */
  setCenter: function (x, y, defValue) {
    this.centerX_ = Math.max(0, x - (this.len_ - 1));
    this.centerY_ = Math.max(0, y - (this.len_ - 1));

    // clean data
    for (var rx = 0; rx < this.len_; rx++) {
      for (var ry = 0; ry < this.len_; ry++) {
        this.data_[rx][ry] = defValue;
      }
    }
  },

  clear: function () {
    this.setCenter(0,0,constants.INACTIVE);
  },

  // @override */
  getValue: function (x, y) {
    x = x - this.centerX_;
    y = y - this.centerY_;

    if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
      return constants.INACTIVE;
    } else {
      return this.data_[x][y];
    }
  },

  // @override */
  setValue: function (x, y, value) {
    x = x - this.centerX_;
    y = y - this.centerY_;

    if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
      throw Error("Out of Bounds");
    } else {
      this.data_[x][y] = value;
    }
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @return {boolean}
  //
  hasActiveNeighbour: function (x, y) {
    x = x - this.centerX_;
    y = y - this.centerY_;

    if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
      throw Error("Out of Bounds");
    }

    return (
      (x > 0 && this.data_[x - 1][y] > 0) ||
        (y > 0 && this.data_[x][y - 1] > 0) ||
        (x < this.len_ - 1 && this.data_[x + 1][y] > 0) ||
        (y < this.len_ - 1 && this.data_[x][y + 1] > 0));
  },

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {number} minValue
  // @param {boolean} walkLeft
  // @param {Function} cb
  // @param {*?} arg
  //
  nextValidPosition: function (x, y, minValue, walkLeft, cb, arg) {
    x = x - this.centerX_;
    y = y - this.centerY_;

    if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
      if (walkLeft) {
        // start bottom right
        x = this.len_ - 1;
        y = this.len_ - 1;

      } else {
        // start top left
        x = 0;
        y = 0;

      }
    }

    // walk to the next position
    var mod = (walkLeft) ? -1 : +1;
    y += mod;
    for (; (walkLeft) ? x >= 0 : x < this.len_; x += mod) {
      for (; (walkLeft) ? y >= 0 : y < this.len_; y += mod) {
        if (this.data_[x][y] >= minValue) {
          // valid position
          cb(x, y, arg);
          return;

        }
      }

      y = (walkLeft) ? this.len_ - 1 : 0;
    }
  },

  //
  //
  // @param {Function} cb
  // @param {*} arg
  // @param {number} minValue
  // @return {boolean}
  //
  nextRandomPosition: function (cb, arg, minValue) {
    if (minValue === void 0) {
      minValue = 0;
    }

    var n = parseInt(Math.random() * this.len_, 10);
    for (var x = 0; x < this.len_; x++) {
      for (var y = 0; y < this.len_; y++) {
        if (this.data_[x][y] >= minValue) {
          n--;

          if (n < 0) {
            cb(x, y, arg);
            return true;
          }
        }
      }
    }

    return false;
  }
};

// init selection data
exports.selection.data_ = [];
for (var i = 0; i < exports.selection.len_; i++) {
  exports.selection.data_[i] = [];
}

//
// Selected game action.
//
exports.action = {

  //
  // Selected sub action object.
  //
  selectedEntry: null,

  //
  // Selected sub action object.
  //
  selectedSubEntry: null,

  //
  // Action object that represents the selected action.
  //
  object: null
};

// Game menu.
//
exports.menu = {

  getSelectedIndex: function () {
    return this.selectedIndex;
  },

  //
  // @type {cwt.CircularBuffer.<String>}
  //
  entries_: new circularBuffer.CircularBuffer(),

  //
  // @type {cwt.CircularBuffer.<boolean>}
  //
  enabled_: new circularBuffer.CircularBuffer(),

  selectedIndex: 0,

  getContent: function (index) {
    if (arguments.length === 0) {
      index = this.selectedIndex;
    }
    return this.entries_.get(index);
  },

  getSize: function () {
    return this.enabled_.size;
  },

  //
  //
  // @return {boolean}
  //
  isEnabled: function () {
    return this.enabled_.get(this.selectedIndex) === true;
  },

  clean: function () {
    this.enabled_.clear();
    this.entries_.clear();
    this.selectedIndex = 0;
  },

  addEntry: function (content, enabled) {
    this.entries_.push(content);
    this.enabled_.push(enabled);
  },

  commandKeys_: null,

  checkRelation_: function (action, relationList, sMode, stMode) {
    var checkMode;

    switch (relationList[1]) {
      case "T" :
        checkMode = sMode;
        break;

      case "ST" :
        checkMode = stMode;
        break;

      default :
        checkMode = null;
    }

    for (var si = 2, se = action.relationToProp.length; si < se; si++) {
      if (action.relationToProp[si] === checkMode) {
        return true;
      }
    }

    return false;
  },

  //
  // Generates the action menu based on the given position data.
  //
  generate: function () {
    var st_mode;
    var sst_mode;
    var pr_st_mode;
    var pr_sst_mode;
    var sPos = exports.source;
    var tPos = exports.target;
    var tsPos = exports.targetselection;
    var ChkU = relationship.CHECK_UNIT;
    var ChkP = relationship.CHECK_PROPERTY;
    var sProp = sPos.property;
    var sUnit = sPos.unit;
    var unitActable = (!(!sUnit || sUnit.owner !== model.turnOwner || !sUnit.canAct));
    var propertyActable = (!(sUnit || !sProp || sProp.owner !== model.turnOwner || sProp.type.blocker));
    var mapActable = (!unitActable && !propertyActable);

    // check_ all game action objects and fill menu
    var actions = actions.getActions();
    for (var i = 0, e = actions.length; i < e; i++) {
      var action = actions[i];

      switch (action.type) {

        case actions.CLIENT_ACTION:
          // TODO: ai check
          if (!mapActable || cwt.Player.activeClientPlayer !== cwt.Gameround.turnOwner) {
            continue;
          }
          break;

        case actions.PROPERTY_ACTION:
          if (!propertyActable) {
            continue;
          }
          break;

        case actions.MAP_ACTION:
          if (!mapActable) {
            continue;
          }
          break;

        case actions.UNIT_ACTION:
          if (!unitActable) {
            continue;
          }

          // extract relationships
          if (st_mode === void 0) {
            st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
            sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
            pr_st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
            pr_sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
          }

          // relation to unit
          if (action.relation) {
            if (!this.checkRelation_(action, action.relation, st_mode, sst_mode)) {
              continue;
            }
          }

          // relation to property
          if (action.relationToProp) {
            if (!this.checkRelation_(action, action.relationToProp, pr_st_mode, pr_sst_mode)) {
              continue;
            }
          }
          break;

        case actions.ENGINE_ACTION:
          continue;
      }

      // if condition matches then add the entry to the menu list
      if (checkConditionByData(action)) {
        exports.menu.addEntry(this.commandKeys[i], true)
      }
    }
  }
};

exports.nextStep = function () {
  exports.movePath.clean();
  exports.menu.clean();
  exports.action.object.prepareMenu(exports.movePath);

  if (!exports.menu.getSize()) {
    stateMachine.changeState("INGAME_IDLE");
  }

  exports.menu.addEntry("done", true);
  exports.inMultiStep = true;

  stateMachine.changeState("INGAME_SUBMENU");
};

exports.nextStepBreak = function () {
  stateMachine.changeState("INGAME_IDLE");
};

// Builds several commands from collected action data.
//
exports.buildFromData = function () {
  var trapped = false;

  if (exports.movePath.data[0] !== -1) {
    trapped = move.trapCheck(exports.movePath, exports.source, exports.target);
  }

  // TODO
  if (!trapped) {
    invokeActionByData();
  }

  // all unit actions invokes automatically waiting
  if (trapped || exports.action.object.type === actions.UNIT_ACTION && !exports.action.object.noAutoWait) {
    actions.sharedAction("wait", exports.source.unitId);
  }

  return trapped;
};