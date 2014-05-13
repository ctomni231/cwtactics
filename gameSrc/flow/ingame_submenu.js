cwt.Gameflow.addInGameState({
  id: "INGAME_SUBMENU",

  enter: function (gameData) {
    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      throw Error("sub menu cannot be empty");
    }
  },

  ACTION: function (gameData) {
    if (gameData.menu.isEnabled()) {
      return;
    }

    var actName = gameData.menu.getContent();

    if (actName === "done") {
      cwt.Gameflow.changeState("INGAME_IDLE");
      return;
    }

    gameData.action.selectedSubEntry = actName;
    var actObj = cwt.Action.getActionObject(actName);

    var next = null;
    if (actObj.prepareTargets && actObj.targetSelectionType === "B") {
      // return this.data.selection.prepare();
    } else {
      next = "INGAME_FLUSH_ACTIONS";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  },

  CANCEL: function () {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});