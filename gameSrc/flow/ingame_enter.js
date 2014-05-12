cwt.Gameflow.addState({
  id: "INGAME_ENTER",

  enter: function () {
    this.globalData.inGameRound = true;

    if (cwt.DEBUG) {
      console.log("entering game round");
    }

    // 1. load map
    cwt.GameData.loadGame(cwt.GameSelectionDTO.map,false, function () {
      cwt.GameSelectionDTO.map = null;

      // 2. change game data by the given configuration
      cwt.GameSelectionDTO.postProcess();

      // 3. render screen
      cwt.Screen.layerUI.clear();
      cwt.TileVariants.updateTileSprites();
      cwt.MapRenderer.updateScreen();

      // 4. start game :P
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
