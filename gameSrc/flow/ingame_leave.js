cwt.Gameflow.addState({
  id: "INGAME_LEAVE",

  enter: function () {
    this.globalData.inGameRound = false;

    // this makes the system mouse cursor visible on the top canvas object
    cwt.Screen.layerUI.getLayer().style.cursor = "";
  }
});
