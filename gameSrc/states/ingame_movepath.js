exports.state = {
  id: "INGAME_MOVEPATH",

  enter: function (gameData) {

    // when we do back steps in the game flow then we don't want to recreate an already created move way
    if (gameData.preventMovePathGeneration) {
      gameData.preventMovePathGeneration = false;
      return;
    }

    var breakMove = false;

    if (cwt.Gameround.isTurnOwnerObject(gameData.source.unit) && gameData.source.unit.canAct) {

      // prepare move map and clean way
      gameData.movePath.clean();

      cwt.Move.fillMoveMap(
        gameData.source,
        gameData.selection,
        gameData.source.x,
        gameData.source.y,
        gameData.source.unit
      );

      // go directly into action menu when the unit cannot move
      if (!gameData.selection.hasActiveNeighbour(x, y)) {
        breakMove = true;
      }
    } else {
      breakMove = true;
    }

    if (breakMove) {
      require("../statemachine").changeState("INGAME_MENU");
    }
  },

  ACTION: function (gameData) {
    var x = cwt.Cursor.x;
    var y = cwt.Cursor.y;

    // selected tile is not in the selection -> ignore action
    if (gameData.selection.getValue(x, y) < 0) {
      return;
    }

    var ox = gameData.target.x;
    var oy = gameData.target.y;
    var dis = cwt.Map.getDistance(ox, oy, x, y);

    gameData.target.set(x, y);

    if (dis === 1) {

      // Try to add the cursor move as code to the move path
      cwt.Move.addCodeToMovePath(
        cwt.Move.codeFromAtoB(ox, oy, x, y),
        gameData.movePath,
        gameData.selection,
        x,
        y
      );

    } else {

      // Generate a complete new path because between the old tile and the new tile is at least another one tile
      cwt.Move.generateMovePath(
        gameData.source.x,
        gameData.source.y,
        x,
        y,
        gameData.selection,
        gameData.movePath
      );
    }

    if (dis === 0 || cwt.Options.fastClickMode) {
      require("../statemachine").changeState(next);
    }
  },

  CANCEL: function () {
    require("../statemachine").changeState("INGAME_IDLE");
  }
};