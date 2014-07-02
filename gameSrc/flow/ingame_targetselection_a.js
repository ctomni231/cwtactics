cwt.Gameflow.addInGameState({
  id: "INGAME_SELECT_TILE_TYPE_A",

  enter: function (gameData) {
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    if (gameData.selection.getValue(cwt.Cursor.x, cwt.Cursor.y) >= 0) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      cwt.Gameflow.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});