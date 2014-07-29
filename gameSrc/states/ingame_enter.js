require("../statemachine").addState({
  id: "INGAME_ENTER",

  enter: function () {
    this.globalData.inGameRound = true;

    if (cwt.DEBUG) {
      console.log("entering game round");
    }

    cwt.Cursor.hideNativeCursor();

    // 1. load map
    cwt.GameData.loadGame(cwt.GameSelectionDTO.map,false, function () {
      cwt.GameSelectionDTO.map = null;

      // 2. change game data by the given configuration
      cwt.GameSelectionDTO.postProcess();
      cwt.Fog.fullRecalculation();

      // 3. update screen
      cwt.Screen.layerUI.clear();
      cwt.TileVariants.updateTileSprites();

      // 4. render screen
      cwt.MapRenderer.renderScreen();
      cwt.MapRenderer.renderCursor();

      // 5. start game :P
      require("../statemachine").changeState("INGAME_IDLE");
    });
    /*
    controller.commandStack_resetData();

    // start first turn
    if (model.round_turnOwner === -1) {
      model.events.gameround_start();
      controller.commandStack_localInvokement("nextTurn_invoked");
      if (controller.network_isHost()) model.events.weather_calculateNext();
    }
//
  }
});
