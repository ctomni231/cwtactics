cwt.Gameflow.addState({
  id: "INGAME_ENTER",

  init: function () {

  },

  enter: function () {
    cwt.Gameflow.inGameRound = true;

    if (cwt.DEBUG) {
      console.log("entering game round");
    }

    cwt.Screen.layerUI.clear();

    var map = cwt.GameSelectionDTO.map;
    cwt.GameSelectionDTO.map = null;

    cwt.GameData.loadGame(map,false, function () {
      cwt.TileVariants.updateTileSprites();
      cwt.MapRenderer.updateScreen();
      cwt.Gameflow.changeState("INGAME_IDLE");
    });
    /*
    controller.commandStack_resetData();

    // start first turn
    if (model.round_turnOwner === -1) {
      model.events.gameround_start();
      controller.commandStack_localInvokement("nextTurn_invoked");
      if (controller.network_isHost()) model.events.weather_calculateNext();
    }
    */
  }
});
