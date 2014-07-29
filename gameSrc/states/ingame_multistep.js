cwt.Gameflow.addState({
  id: "INGAME_MULTISTEP_IDLE",

  init: function () {
    var gameData = this.globalData;

    gameData.inMultiStep = false;

    gameData.nextStep = function () {
      gameData.movePath.clean();
      gameData.menu.clean();
      gameData.action.object.prepareMenu(this.data);

      if (!gameData.menu.getSize()) {
        cwt.Gameflow.changeState("INGAME_IDLE");
      }

      gameData.menu.addEntry("done", true);
      gameData.inMultiStep = true;

      cwt.Gameflow.changeState("INGAME_SUBMENU");
    };

    gameData.nextStepBreak = function () {
      cwt.Gameflow.changeState("INGAME_IDLE");
    };
  },

  enter: function () {
    this.globalData.inMultiStep = false;
  }
});