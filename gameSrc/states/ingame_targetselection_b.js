exports.state = {
  id: "INGAME_SELECT_TILE_TYPE_B",

  enter: function (gameData) {
    this.data.targetselection.clean();
  },

  ACTION: function () {
    if (this.data.selection.getValue(this.data.cursorX, this.data.cursorY) >= 0) {
      this.data.targetselection.set(this.data.cursorX, this.data.cursorY);
      this.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    this.changeState("INGAME_MENU");
  }
};