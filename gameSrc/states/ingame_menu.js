"use strict";

var stateData = require("../states");
var assert = require("../system/functions").assert;
var constants = require("../constants");
var renderer = require("../renderer");
var action = require("../actions");
var input = require("../input");

var updateMenuData = function () {
  stateData.menu.selectedIndex = renderer.getMenuIndex();
  renderer.renderMenu();
  renderer.layerUI.renderLayer(0);
};

exports.state = {
  id: "INGAME_MENU",

  enter: function () {
    renderer.showNativeCursor();

    stateData.menu.clean();
    stateData.menu.generate();

    // go back when no entries exists
    if (stateData.menu.getSize() === 0) {
      this.changeState("INGAME_IDLE");

    } else {
      renderer.resetMenuShift();
      renderer.layerUI.clear(0);
      renderer.prepareMenu(stateData.menu);
      renderer.layerUI.renderLayer(0);
    }
  },

  exit: function () {
    renderer.hideNativeCursor();
    renderer.layerUI.clear(0);
    renderer.layerUI.clear();
    // FIXME: renderer can use stateData to grab cursor pos
    renderer.renderCursor(stateData.cursorX, stateData.cursorY);
  },

  inputMove: function (x, y) {
    renderer.updateMenuIndex(x, y);
    updateMenuData();
  },

  UP: function () {
    var res = renderer.handleMenuInput(input.TYPE_UP);
    if (res === 2) renderer.prepareMenu();
    if (res >= 1) updateMenuData();
  },

  DOWN: function () {
    var res = renderer.handleMenuInput(input.TYPE_DOWN);
    if (res === 2) renderer.prepareMenu();
    if (res >= 1) updateMenuData();
  },

  ACTION: function () {
    var actName = stateData.menu.getContent();
    var actObj = action.getAction(actName);

    // select action in data
    stateData.action.selectedEntry = actName;
    stateData.action.object = actObj;

    // calculate next state from the given action object
    var next = null;
    if (actObj.prepareMenu !== null) {
      next = "INGAME_SUBMENU";
    } else if (actObj.isTargetValid !== null) {
      next = "INGAME_SELECT_TILE";
    } else if (actObj.prepareTargets !== null && actObj.targetSelectionType === "A") {
      next = "INGAME_SELECT_TILE_TYPE_A";
    } else {
      next = "INGAME_FLUSH_ACTION";
    }

    if (constants.DEBUG) assert(next);
    this.changeState(next);
  },

  CANCEL: function () {
    var unit = stateData.source.unit;
    var next = null;

    if (unit && unit.owner.activeClientPlayer) {
      // unit was selected and it is controlled by the active player, so it means that this unit is the acting unit
      // -> go back to *INGAME_MOVEPATH* state without erasing the existing move data

      stateData.preventMovePathGeneration = true;
      next = "INGAME_MOVEPATH";

    } else {
      next = "INGAME_IDLE";
    }

    if (constants.DEBUG) assert(next);
    this.changeState(next);
  }
};
