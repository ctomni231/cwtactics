var renderer = require("../renderer");
var constants = require("../constants");

var stateData = require("../dataTransfer/states");
var roundDTO = require("../dataTransfer/roundSetup");

var fog = require("../logic/fog");
var renderer = require("../renderer");
var tileVariants = require("../tileVariants");

var gamePers = require("../dataTransfer/savegame");

exports.state = {
  id: "INGAME_ENTER",

  enter: function () {
    stateData.inGameRound = true;
    renderer.hideNativeCursor();

    if (constants.DEBUG) console.log("entering game round");

    // 1. load map
    gamePers.initMap(roundDTO.getSelectMap(),false, function () {
      roundDTO.selectMap(null);

      // 2. change game data by the given configuration
      roundDTO.postProcess();
      fog.fullRecalculation();

      // 3. update screen
      renderer.layerUI.clear();
      tileVariants.updateTileSprites();

      // 4. render screen
      renderer.renderScreen();
      renderer.renderCursor();

      // 5. start game :P
      this.changeState("INGAME_IDLE");
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
};
