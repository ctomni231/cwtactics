"use strict";

var constants = require("../constants.js");
var assert = require("../system/functions.js").assert;
var stateData = require("../states");
var action = require("../actions");
var renderer = require("../renderer");
var menuState = require("./ingame_menu");

exports.state = {
  id: "INGAME_SUBMENU",

  enter: function () {
    renderer.showNativeCursor();

    stateData.menu.clean();
    stateData.menu.generateSubMenu();

    // go back when no entries exists
    if (stateData.menu.getSize() === 0) {
      throw Error("sub menu cannot be empty");
    }

    renderer.resetMenuShift();
    renderer.layerUI.clear(0);
    renderer.prepareMenu(stateData.menu);
    renderer.layerUI.renderLayer(0);
  },

  inputMove: menuState.state.inputMove,

  UP: menuState.state.UP,

  DOWN: menuState.state.DOWN,

  exit: function () {
    renderer.hideNativeCursor();
    renderer.layerUI.clear(0);
    renderer.layerUI.clear();
    // FIXME: renderer can use stateData to grab cursor pos
    renderer.renderCursor(stateData.cursorX, stateData.cursorY);
  },

  ACTION: function () {
    if (!stateData.menu.isEnabled()) {
      return;
    }

    var actName = stateData.menu.getContent();

    if (actName === "done") {
      this.changeState("INGAME_IDLE");
      return;
    }

    stateData.action.selectedSubEntry = actName;
    var actObj = action.getAction(stateData.action.selectedEntry);

    var next = null;
    if (actObj.prepareTargets && actObj.targetSelectionType === "B") {
      stateData.generateTargetSelectionFocus();
      next = "INGAME_SELECT_TILE_TYPE_B";
    } else {
      next = "INGAME_FLUSH_ACTION";
    }

    if (constants.DEBUG) assert(next);
    this.changeState(next);
  },

  CANCEL: function () {
    this.changeState("INGAME_MENU");
  }
};
