exports.state = {
  id: "INGAME_MENU",

  enter: function (gameData) {
    cwt.Cursor.showNativeCursor();

    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      require("../statemachine").changeState("INGAME_IDLE");
    } else {
      cwt.Screen.layerUI.clear(0);
      cwt.MapRenderer.prepareMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  exit: function () {
    cwt.Cursor.hideNativeCursor();
    cwt.Screen.layerUI.clear(0);
    cwt.Screen.layerUI.clear();
  },

  inputMove: function (gameData, x, y) {
    cwt.MapRenderer.layoutGenericMenu_.updateIndex(x, y);
    gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
    cwt.MapRenderer.renderMenu(gameData.menu);
    cwt.Screen.layerUI.renderLayer(0);
  },

  UP: function (gameData) {
    if (cwt.MapRenderer.layoutGenericMenu_.handleInput(cwt.Input.TYPE_UP)) {
      gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
      cwt.MapRenderer.renderMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  DOWN: function (gameData) {
    if (cwt.MapRenderer.layoutGenericMenu_.handleInput(cwt.Input.TYPE_DOWN)) {
      gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
      cwt.MapRenderer.renderMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  ACTION: function (gameData) {
    var actName = gameData.menu.getContent();
    var actObj = cwt.Action.getActionObject(actName);

    // select action in data
    gameData.action.selectedEntry = actName;
    gameData.action.object = actObj;

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

    if (cwt.DEBUG) cwt.assert(next);
    require("../statemachine").changeState(next);
  },

  CANCEL: function (gameData) {
    var unit = gameData.source.unit;
    var next = null;

    if (unit && unit.owner.activeClientPlayer) {
      // unit was selected and it is controlled by the active player, so it means that this unit
      // is the acting unit -> go back to INGAME_MOVEPATH state without erasing the existing move data

      gameData.preventMovePathGeneration = true;
      next = "INGAME_MOVEPATH";

    } else {
      next = "INGAME_IDLE";
    }

    if (cwt.DEBUG) cwt.assert(next);
    require("../statemachine").changeState(next);
  }
};