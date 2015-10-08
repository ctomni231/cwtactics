package org.wolftec.cwt.states;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.InformationList;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.model.PositionData;
import org.wolftec.cwt.system.CircularBuffer;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.MoveableMatrix;

public class UserInteractionData implements Injectable, InformationList {

  private Log log;

  private ActionManager actions;

  public Player actor;

  public PositionData source;
  public PositionData target;
  public PositionData actionTarget;

  public CircularBuffer<Integer> movePath;

  public CircularBuffer<String> infos;
  public int                    infoIndex;

  public String action;
  public int    actionCode;

  public String actionData;
  public int    actionDataCode;

  public MoveableMatrix targets;

  public int cursorX;
  public int cursorY;

  public boolean preventMovepathGeneration;

  @Override
  public void onConstruction() {
    source = new PositionData();
    target = new PositionData();
    actionTarget = new PositionData();

    movePath = new CircularBuffer<>(Constants.MAX_SELECTION_RANGE);
    infos = new CircularBuffer<>(50);

    targets = new MoveableMatrix(Constants.MAX_SELECTION_RANGE);
  }

  @Override
  public void addInfo(String key, boolean flag) {
    infos.push(key);
    log.info("added user action [" + key + "]");
  }

  @Override
  public void cleanInfos() {
    infos.clear();
    infoIndex = 0;
    log.info("cleaned user actions");
  }

  @Override
  public int getNumberOfInfos() {
    return infos.getSize();
  }

  public Action getAction() {
    return actions.getAction(action);
  }

  @Override
  public void increaseIndex() {
    infoIndex++;
    if (infoIndex == getNumberOfInfos()) {
      infoIndex = 0;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  @Override
  public void decreaseIndex() {
    infoIndex--;
    if (infoIndex < 0) {
      infoIndex = getNumberOfInfos() - 1;
    }
    log.info("current selected user action [" + getInfo() + "]");
  }

  @Override
  public String getInfo() {
    return infos.get(infoIndex);
  }

  @Override
  public String getInfoAtIndex(int index) {
    return infos.get(index);
  }

  public void printMoveMapToConsole() {
    String result = "\n";
    result += "Left Corner {" + targets.getCenterX() + "," + targets.getCenterY() + "} \n";
    for (int y = 0; y < targets.getDataArray().$length(); y++) {
      result += "[ ";
      for (int x = 0; x < targets.getDataArray().$length(); x++) {
        int value = targets.getValue(x, y);

        if (value == Constants.INACTIVE) {
          result += "##";
        } else {
          result += ((100 + value) + "").substring(1);
        }

        if (x < targets.getDataArray().$length() - 1) {
          result += " - ";
        }
      }
      result += " ]\n";
    }
    log.info(result);
  }

  public void printMoveArrayToConsole() {
    String result = "\n";

    result += "[ ";
    for (int y = 0; y < movePath.getSize(); y++) {
      switch (movePath.get(y)) {
        case MoveLogic.MOVE_CODES_DOWN:
          result += "D";
          break;

        case MoveLogic.MOVE_CODES_UP:
          result += "U";
          break;

        case MoveLogic.MOVE_CODES_LEFT:
          result += "L";
          break;

        case MoveLogic.MOVE_CODES_RIGHT:
          result += "R";
          break;

        default:
          break;
      }

      if (y < movePath.getSize() - 1) {
        result += " - ";
      }
    }
    result += " ]";

    log.info(result);
  }

  //
  // /** */
  // exports.fromIngameToOptions = false;
  //
  // /** */
  // exports.inGameRound = true;
  //
  // /** */
  // exports.multiStepActive = false;
  //
  // /**
  // *
  // * @type {boolean}
  // */
  // exports.preventMovePathGeneration = false;
  //
  // exports.inMultiStep = false;
  //
  // exports.focusMode = constants.INACTIVE;
  //
  // /**
  // *
  // */
  // exports.resetCursor = function () {
  // exports.cursorX = 0;
  // exports.cursorY = 0;
  // };
  //
  // /** Moves the cursor into a given direction. */
  // exports.moveCursor = function (dir) {
  // var len = 1;
  // var x = exports.cursorX;
  // var y = exports.cursorY;
  //
  // switch (dir) {
  //
  // case move.MOVE_CODES_UP :
  // y -= len;
  // break;
  //
  // case move.MOVE_CODES_RIGHT :
  // x += len;
  // break;
  //
  // case move.MOVE_CODES_DOWN :
  // y += len;
  // break;
  //
  // case move.MOVE_CODES_LEFT :
  // x -= len;
  // break;
  // }
  //
  // exports.setCursorPosition(x, y);
  // };
  //
  // /**
  // * Moves the cursor to a given position. The view will be moved as well with
  // this function to make sure that the cursor is on the visible view.
  // */
  // exports.setCursorPosition = function (x, y, relativeToScreen) {
  // if (relativeToScreen) {
  // x = x + renderer.screenOffsetX;
  // y = y + renderer.screenOffsetY;
  // }
  //
  // // change illegal positions to prevent out of bounds
  // if (x < 0) x = 0;
  // if (y < 0) y = 0;
  // if (x >= model.mapWidth) x = model.mapWidth - 1;
  // if (y >= model.mapHeight) y = model.mapHeight - 1;
  //
  // if (x === exports.cursorX && y === exports.cursorY) {
  // return;
  // }
  //
  // renderer.eraseCursor(exports.cursorX, exports.cursorY);
  //
  // exports.cursorX = x;
  // exports.cursorY = y;
  //
  // // convert to screen relative pos
  // x = x - renderer.screenOffsetX;
  // y = y - renderer.screenOffsetY;
  //
  // var moveCode = constants.INACTIVE;
  // if (x <= 3) moveCode = move.MOVE_CODES_RIGHT;
  // if (y <= 3) moveCode = move.MOVE_CODES_DOWN;
  // if (x >= constants.SCREEN_WIDTH - 3) moveCode = move.MOVE_CODES_LEFT;
  // if (y >= constants.SCREEN_HEIGHT - 3) moveCode = move.MOVE_CODES_UP;
  //
  // // do possible screen shift
  // if (moveCode !== constants.INACTIVE) {
  // if (renderer.shiftScreen(moveCode)) {
  // renderer.shiftMap(moveCode);
  // }
  // }
  //
  // renderer.renderCursor(exports.cursorX, exports.cursorY);
  // };
  //
  // exports.selection = {
  //
  // /** @private */
  // len_: constants.MAX_MOVE_LENGTH * 4,
  //
  // /** @private */
  // data_: null,
  //
  // /** @private */
  // centerX_: 0,
  //
  // /** @private */
  // centerY_: 0,
  //
  // /** @override */
  // getData: function () {
  // return this.data_;
  // },
  //
  // /** @override */
  // getCenterX: function () {
  // return this.centerX_;
  // },
  //
  // /** @override */
  // getCenterY: function () {
  // return this.centerY_;
  // },
  //
  // /** @override */
  // setCenter: function (x, y, defValue) {
  // this.centerX_ = Math.max(0, x - (this.len_ - 1));
  // this.centerY_ = Math.max(0, y - (this.len_ - 1));
  //
  // // clean data
  // for (var rx = 0; rx < this.len_; rx++) {
  // for (var ry = 0; ry < this.len_; ry++) {
  // this.data_[rx][ry] = defValue;
  // }
  // }
  // },
  //
  // clear: function () {
  // this.setCenter(0, 0, constants.INACTIVE);
  // },
  //
  // /** @override */
  // getValue: function (x, y) {
  // x = x - this.centerX_;
  // y = y - this.centerY_;
  //
  // if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
  // return constants.INACTIVE;
  // } else {
  // return this.data_[x][y];
  // }
  // },
  //
  // /** @override */
  // setValue: function (x, y, value) {
  // x = x - this.centerX_;
  // y = y - this.centerY_;
  //
  // if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
  // throw Error("Out of Bounds");
  // } else {
  // this.data_[x][y] = value;
  // }
  // },
  //
  // /**
  // *
  // * @param x
  // * @param y
  // * @returns {boolean}
  // */
  // hasActiveNeighbour: function (x, y) {
  // x = x - this.centerX_;
  // y = y - this.centerY_;
  //
  // if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
  // throw Error("Out of Bounds");
  // }
  //
  // return (
  // (x > 0 && this.data_[x - 1][y] > 0) ||
  // (y > 0 && this.data_[x][y - 1] > 0) ||
  // (x < this.len_ - 1 && this.data_[x + 1][y] > 0) ||
  // (y < this.len_ - 1 && this.data_[x][y + 1] > 0));
  // },
  //
  // /**
  // *
  // * @param x
  // * @param y
  // * @param minValue
  // * @param walkLeft
  // * @param cb
  // * @param arg
  // */
  // nextValidPosition: function (x, y, minValue, walkLeft, cb, arg) {
  // x = x - this.centerX_;
  // y = y - this.centerY_;
  //
  // if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
  // if (walkLeft) {
  // // start bottom right
  // x = this.len_ - 1;
  // y = this.len_ - 1;
  //
  // } else {
  // // start top left
  // x = 0;
  // y = 0;
  //
  // }
  // }
  //
  // // walk to the next position
  // var mod = (walkLeft) ? -1 : +1;
  // y += mod;
  // for (; (walkLeft) ? x >= 0 : x < this.len_; x += mod) {
  // for (; (walkLeft) ? y >= 0 : y < this.len_; y += mod) {
  // if (this.data_[x][y] >= minValue) {
  // // valid position
  // cb(x, y, arg);
  // return;
  //
  // }
  // }
  //
  // y = (walkLeft) ? this.len_ - 1 : 0;
  // }
  // },
  //
  // /**
  // *
  // * @param cb
  // * @param arg
  // * @param minValue
  // * @returns {boolean}
  // */
  // nextRandomPosition: function (cb, arg, minValue) {
  // if (minValue === void 0) {
  // minValue = 0;
  // }
  //
  // var n = parseInt(Math.random() * this.len_, 10);
  // for (var x = 0; x < this.len_; x++) {
  // for (var y = 0; y < this.len_; y++) {
  // if (this.data_[x][y] >= minValue) {
  // n--;
  //
  // if (n < 0) {
  // cb(x, y, arg);
  // return true;
  // }
  // }
  // }
  // }
  //
  // return false;
  // },
  //
  // /**
  // * Sets all values to the value of newValue. If fixedValue is given, then
  // all positions with the same
  // * value as fixedValue won't change its value.
  // *
  // * @param newValue
  // * @param fixedValue
  // */
  // setAllValuesTo: function (newValue, fixedValue) {
  // for (var x = 0; x < this.len_; x++) {
  // for (var y = 0; y < this.len_; y++) {
  // if (this.data_[x][y] != fixedValue) {
  // this.data_[x][y] = newValue;
  // }
  // }
  // }
  // },
  //
  // /**
  // * Calls the doIt function on the given doItHolder object on all positions
  // with va value greater equals
  // * minValue and lower equals maxValue.
  // *
  // * @param minValue
  // * @param maxValue
  // * @param doItHolder
  // */
  // onAllValidPositions: function (minValue, maxValue, doItHolder) {
  // for (var x = 0; x < this.len_; x++) {
  // for (var y = 0; y < this.len_; y++) {
  // var value = this.data_[x][y];
  // if (value >= minValue && value <= maxValue) {
  // doItHolder.doIt(x, y, value, this);
  // }
  // }
  // }
  // }
  // };
  //
  // // init selection data
  // exports.selection.data_ = [];
  // for (var i = 0; i < exports.selection.len_; i++) {
  // exports.selection.data_[i] = [];
  // }
  //
  // var checkRelation = function (action, relationList, sMode, stMode) {
  // var checkMode;
  //
  // switch (relationList[1]) {
  // case "T" :
  // checkMode = sMode;
  // break;
  //
  // case "ST" :
  // checkMode = stMode;
  // break;
  //
  // default :
  // checkMode = null;
  // }
  //
  // for (var si = 2, se = relationList.length; si < se; si++) {
  // if (relationList[si] === checkMode) {
  // return true;
  // }
  // }
  //
  // return false;
  // };
  //
  // /** Selected game action. */
  // exports.action = {
  //
  // //
  // // Selected sub action object.
  // //
  // selectedEntry: null,
  //
  // //
  // // Selected sub action object.
  // //
  // selectedSubEntry: null,
  //
  // //
  // // Action object that represents the selected action.
  // //
  // object: null
  // };
  //
  // /** Game menu. */
  // exports.menu = {
  //
  // getSelectedIndex: function () {
  // return this.selectedIndex;
  // },
  //
  // //
  // // @type {cwt.CircularBuffer.<String>}
  // //
  // entries_: new circularBuffer.CircularBuffer(),
  //
  // //
  // // @type {cwt.CircularBuffer.<boolean>}
  // //
  // enabled_: new circularBuffer.CircularBuffer(),
  //
  // selectedIndex: 0,
  //
  // getContent: function (index) {
  // if (arguments.length === 0) {
  // index = this.selectedIndex;
  // }
  // return this.entries_.get(index);
  // },
  //
  // getSize: function () {
  // return this.enabled_.size;
  // },
  //
  // //
  // //
  // // @return {boolean}
  // //
  // isEnabled: function () {
  // return this.enabled_.get(this.selectedIndex) === true;
  // },
  //
  // clean: function () {
  // this.enabled_.clear();
  // this.entries_.clear();
  // this.selectedIndex = 0;
  // },
  //
  // addEntry: function (content, enabled) {
  // this.entries_.push(content);
  // this.enabled_.push(enabled);
  // },
  //
  // //
  // // Generates the action menu based on the given position data.
  // //
  // generate: function () {
  // var st_mode;
  // var sst_mode;
  // var pr_st_mode;
  // var pr_sst_mode;
  // var sPos = exports.source;
  // var tPos = exports.target;
  // var tsPos = exports.targetselection;
  // var ChkU = relationship.CHECK_UNIT;
  // var ChkP = relationship.CHECK_PROPERTY;
  // var sProp = sPos.property;
  // var sUnit = sPos.unit;
  // var unitActable = (!(!sUnit || sUnit.owner !== model.turnOwner ||
  // !sUnit.canAct));
  // var propertyActable = (!(sUnit || !sProp || sProp.owner !== model.turnOwner
  // || sProp.type.blocker));
  // var mapActable = (!unitActable && !propertyActable);
  //
  //
  // // check_ all game action objects and fill menu
  // var actions = actionsLib.getActions();
  // for (var i = 0, e = actions.length; i < e; i++) {
  // var action = actions[i];
  //
  // switch (action.type) {
  //
  // case actionsLib.CLIENT_ACTION:
  // // TODO: ai check
  // if (!mapActable || model.Player.activeClientPlayer !== model.turnOwner) {
  // continue;
  // }
  // break;
  //
  // case actionsLib.PROPERTY_ACTION:
  // if (!propertyActable) {
  // continue;
  // }
  // break;
  //
  // case actionsLib.MAP_ACTION:
  // if (!mapActable) {
  // continue;
  // }
  // break;
  //
  // case actionsLib.UNIT_ACTION:
  // if (!unitActable) {
  // continue;
  // }
  //
  // // extract relationships
  // if (!st_mode) {
  // st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
  // sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
  // pr_st_mode = relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
  // pr_sst_mode = relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
  // }
  //
  // // relation to unit
  // if (action.relation) {
  // if (!checkRelation(action, action.relation, st_mode, sst_mode)) {
  // continue;
  // }
  // }
  //
  // // relation to property
  // if (action.relationToProp) {
  // if (!checkRelation(action, action.relationToProp, pr_st_mode, pr_sst_mode))
  // {
  // continue;
  // }
  // }
  // break;
  //
  // case actionsLib.ENGINE_ACTION:
  // continue;
  // }
  //
  // // if condition matches then add the entry to the menu list
  // if (checkConditionByData(action)) {
  // exports.menu.addEntry(action.key, true)
  // }
  // }
  // },
  //
  // generateSubMenu: function () {
  // prepareMenuByData(exports.action.object);
  // }
  // };
  //
  // exports.nextStep = function () {
  // exports.movePath.clean();
  // exports.menu.clean();
  // exports.action.object.prepareMenu(exports.movePath);
  //
  // if (!exports.menu.getSize()) {
  // stateMachine.changeState("INGAME_IDLE");
  // }
  //
  // exports.menu.addEntry("done", true);
  // exports.inMultiStep = true;
  //
  // stateMachine.changeState("INGAME_SUBMENU");
  // };
  //
  // exports.nextStepBreak = function () {
  // stateMachine.changeState("INGAME_IDLE");
  // };
  //
  // exports.generateTargetSelectionFocus = function () {
  // prepareTargetsByData(exports.action.object);
  // };
  //
  // /** Builds several commands from collected action data. */
  // exports.buildFromData = function () {
  // var trapped = false;
  //
  // // TODO check trap (move has to be stopped)
  // if (exports.movePath.size > 0) {
  // trapped = move.trapCheck(exports.movePath, exports.source, exports.target);
  //
  // actionsLib.sharedAction("moveStart", exports.source.unitId,
  // exports.source.x, exports.source.y);
  //
  // for (var i = 0, e = exports.movePath.size; i < e; i += 5) {
  // actionsLib.sharedAction("moveAppend",
  // exports.movePath.size > i ? exports.movePath.get(i) : constants.INACTIVE,
  // exports.movePath.size > i + 1 ? exports.movePath.get(i + 1) :
  // constants.INACTIVE,
  // exports.movePath.size > i + 2 ? exports.movePath.get(i + 2) :
  // constants.INACTIVE,
  // exports.movePath.size > i + 3 ? exports.movePath.get(i + 3) :
  // constants.INACTIVE,
  // exports.movePath.size > i + 4 ? exports.movePath.get(i + 4) :
  // constants.INACTIVE
  // );
  // }
  //
  // var posUpdateMode = exports.action.object.positionUpdateMode;
  // actionsLib.sharedAction("moveEnd",
  // (posUpdateMode === actionsLib.PREVENT_CLEAR_OLD_POS),
  // (posUpdateMode === actionsLib.PREVENT_SET_NEW_POS));
  // }
  //
  // if (!trapped) {
  // invokeActionByData();
  // }
  //
  // // all unit actions invokes automatically waiting
  // if (trapped || exports.action.object.type === actionsLib.UNIT_ACTION &&
  // !exports.action.object.noAutoWait) {
  // actionsLib.sharedAction("wait", exports.source.unitId);
  // }
  //
  // return trapped;
  // };
  //
}
