exports.state = {
  id: "INGAME_IDLE",

  enter: function (gameData) {
    gameData.source.clean();
    gameData.target.clean();
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    var x = cwt.Cursor.x;
    var y = cwt.Cursor.y;

    gameData.source.set(x, y);
    gameData.target.set(x, y);

    require("../statemachine").changeState("INGAME_MOVEPATH");
  }
};
