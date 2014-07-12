cwt.Gameflow.addState({
  id: "INGAME_LEAVE",

  enter: function () {
    this.globalData.inGameRound = false;
    cwt.Cursor.showNativeCursor();
  }
});
