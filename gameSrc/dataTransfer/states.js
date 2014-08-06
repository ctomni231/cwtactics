// Shared data that will be used between the states.
//

var move = require("../logic/move");
var model = require("../model");
var constants = require("../constants");
var cursorRenderer = require("../renderer/cursor");

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
    x = x + cwt.Screen.offsetX;
    y = y + cwt.Screen.offsetY;
  }

  // change illegal positions to prevent out of bounds
  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x >= model.mapWidth) x = model.mapWidth - 1;
  if (y >= model.mapHeight) y = model.mapHeight - 1;

  if (x === this.x && y === this.y) {
    return;
  }

  cursorRenderer.eraseCursor();

  this.x = x;
  this.y = y;

  // convert to screen relative pos
  x = x - cwt.Screen.offsetX;
  y = y - cwt.Screen.offsetY;

  // do possible screen shift
  var moveCode = constants.INACTIVE;
  if (x <= 3) {
    moveCode = move.MOVE_CODES_RIGHT;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }

  }

  // do possible screen shift
  if (x >= constants.SCREEN_WIDTH - 3) {
    moveCode = move.MOVE_CODES_LEFT;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }
  }

  // do possible screen shift
  if (y <= 3) {
    moveCode = move.MOVE_CODES_DOWN;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }

  }

  // do possible screen shift
  if (y >= constants.SCREEN_HEIGHT - 3) {
    moveCode = move.MOVE_CODES_UP;
    if (cwt.Screen.shiftScreen(moveCode)) {
      cwt.MapRenderer.shiftMap(moveCode);
    }
  }

  cursorRenderer.renderCursor();
};

//
//
exports.fromIngameToOptions = false;

//
//
exports.inGameRound = true;

//
//
exports.multiStepActive = false;

// Builds several commands from collected action data.
//
exports.buildFromData = function () {
  var targetDto = exports.target;
  var sourceDto = exports.source;
  var actionDto = exports.action;
  var moveDto = exports.movePath;
  var actionObject = actionDto.object;

  var trapped = false;
  if (moveDto.data[0] !== -1) {
    trapped = model.move_trapCheck(moveDto.data, sourceDto, targetDto);
    model.events.move_flushMoveData(moveDto.data, sourceDto);
  }

  if (!trapped) actionObject.invoke(scope);
  else controller.commandStack_sharedInvokement(
    "trapwait_invoked",
    sourceDto.unitId
  );

  // all unit actions invokes automatically waiting
  if (trapped || actionObject.unitAction && !actionObject.noAutoWait) {
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      sourceDto.unitId
    );
  }

  return trapped;
};

//
// Position object with rich information about the selected position by an action and some relations.
//
exports.source = new cwt.PositionDataClass();

// Position object with rich information about the selected position by an action and some relations.
//
exports.target = new cwt.PositionDataClass();

// Position object with rich information about the selected position by an action and some relations.
//
exports.targetselection = new cwt.PositionDataClass();

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

    // lazy initialization
    if (!this.data_) {
      this.data_ = [];
      for (var i = 0; i < this.len_; i++) {
        this.data_[i] = [];
      }
    }

    this.centerX = Math.max(0, x - (this.len_ - 1));
    this.centerY = Math.max(0, y - (this.len_ - 1));

    // clean data
    for (var rx = 0; rx < this.len_; rx++) {
      for (var ry = 0; ry < this.len_; ry++) {
        this.data_[rx][ry] = defValue;
      }
    }
  },

  // @override */
  getValue: function (x, y) {
    x = x - this.centerX_;
    y = y - this.centerY_;

    if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
      return cwt.INACTIVE;
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

    if ((x > 0 && this.len_[x - 1][y] > 0) ||
      (y > 0 && this.len_[x][y - 1] > 0) ||
      (x < this.data_ - 1 && this.data_[x + 1][y] > 0) ||
      (y < this.data_ - 1 && this.data_[x][y + 1] > 0)) {

      return true;
    } else {
      return false;
    }
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

//
// Selected game action.
//
// @memberOf require("../statemachine").globalData
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

//
// Game menu.
//
// @memberOf require("../statemachine").globalData
// @implements {cwt.InterfaceMenu.<String>}
//
exports.menu = {

  getSelectedIndex: function () {
    return this.selectedIndex;
  },

  //
  // @type {cwt.CircularBuffer.<String>}
  //
  entries_: new cwt.CircularBuffer(),

  //
  // @type {cwt.CircularBuffer.<boolean>}
  //
  enabled_: new cwt.CircularBuffer(),

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
    if (!this.commandKeys) {
      this.commandKeys = cwt.Action.getRegisteredNames();
    }

    var st_mode;
    var sst_mode;
    var pr_st_mode;
    var pr_sst_mode;
    var sPos = gameData.source;
    var tPos = gameData.target;
    var tsPos = gameData.targetselection;
    var ChkU = cwt.Relationship.CHECK_UNIT;
    var ChkP = cwt.Relationship.CHECK_PROPERTY;
    var sProp = sPos.property;
    var sUnit = sPos.unit;
    var unitActable = (!(!sUnit || sUnit.owner !== cwt.Gameround.turnOwner || !sUnit.canAct));
    var propertyActable = (!(sUnit || !sProp || sProp.owner !== cwt.Gameround.turnOwner || sProp.type.blocker));
    var mapActable = (!unitActable && !propertyActable);

    // check_ all game action objects and fill menu
    for (var i = 0, e = this.commandKeys.length; i < e; i++) {
      var action = cwt.Action.getActionObject(this.commandKeys[i]);

      switch (action.type) {

        case cwt.Action.CLIENT_ACTION:
          // TODO: ai check
          if (!mapActable || cwt.Player.activeClientPlayer !== cwt.Gameround.turnOwner) {
            continue;
          }
          break;

        case cwt.Action.PROPERTY_ACTION:
          if (!propertyActable) {
            continue;
          }
          break;

        case cwt.Action.MAP_ACTION:
          if (!mapActable) {
            continue;
          }
          break;

        case cwt.Action.UNIT_ACTION:
          if (!unitActable) {
            continue;
          }

          // extract relationships
          if (st_mode === void 0) {
            st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
            sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
            pr_st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
            pr_sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
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

        case cwt.Action.ENGINE_ACTION:
          continue;
      }

      // if condition matches then add the entry to the menu list
      if (action.condition && action.condition(gameData) !== false) {
        gameData.menu.addEntry(this.commandKeys[i], true)
      }
    }
  }
};

//
//
// @type {cwt.CircularBuffer}
// @memberOf require("../statemachine").globalData
//
exports.movePath = new cwt.CircularBuffer(cwt.MAX_MOVE_LENGTH);

//
//
// @type {boolean}
//
exports.preventMovePathGeneration = false;

exports.inMultiStep = false;

exports.nextStep = function () {
  gameData.movePath.clean();
  gameData.menu.clean();
  gameData.action.object.prepareMenu(this.data);

  if (!gameData.menu.getSize()) {
    require("../statemachine").changeState("INGAME_IDLE");
  }

  gameData.menu.addEntry("done", true);
  gameData.inMultiStep = true;

  require("../statemachine").changeState("INGAME_SUBMENU");
};

exports.nextStepBreak = function () {
  require("../statemachine").changeState("INGAME_IDLE");
};