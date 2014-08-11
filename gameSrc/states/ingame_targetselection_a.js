exports.state = {
  id: "INGAME_SELECT_TILE_TYPE_A",

  enter: function (gameData) {
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    if (gameData.selection.getValue(cwt.Cursor.x, cwt.Cursor.y) >= 0) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      require("../statemachine").changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    require("../statemachine").changeState("INGAME_MENU");
  }
}
