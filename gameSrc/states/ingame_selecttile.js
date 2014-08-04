exports.state = {
  id: "INGAME_SELECT_TILE",

  enter: function (gameData) {
    gameData.targetselection.clean();

    /*
     var prepareSelection = this.data.action.object.prepareSelection;
     if (prepareSelection) prepareSelection(this.data);
     else this.data.selectionRange = 1;
    */
  },

  ACTION: function (gameData) {
    if (gameData.action.object.isTargetValid(gameData, cwt.Cursor.x, cwt.Cursor.y)) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      require("../statemachine").changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    require("../statemachine").changeState("INGAME_MENU");
  }
};