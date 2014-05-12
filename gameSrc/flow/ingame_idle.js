cwt.Gameflow.addInGameState({
  id: "INGAME_IDLE",

  // create game round data in global data scope
  init: function () {
    var gameData = this.globalData;

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.source = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.target = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.targetselection = new cwt.Position();

    /**
     *
     * @memberOf cwt.Gameflow.globalData
     * @type {boolean}
     */
    gameData.multiStepActive = false;

    gameData.makeMultistep = true;
  },

  enter: function () {

    /** @borrows cwt.Gameflow.globalData as gameData */
    var gameData = this.globalData;

    gameData.source.clean();
    gameData.target.clean();
    gameData.targetselection.clean();
  },

  ACTION: function () {
    var gameData = this.globalData;

    gameData.source.set(x, y);
    gameData.target.set(x, y);

    var next = null;
    if (cwt.Gameround.isTurnOwnerObject(gameData.source.unit) && gameData.source.unit.canAct) {
      gameData.movePath.clean();
      gameData.movePath.move_fillMoveMap();

      // go directly into action menu when the unit cannot move
      next = (!gameData.selection.hasActiveNeighbour(x, y))? "ACTION_MENU" : "MOVEPATH_SELECTION";
    } else {
      next = "ACTION_MENU";
    }

    cwt.Gameflow.changeState(next);
  }
});
