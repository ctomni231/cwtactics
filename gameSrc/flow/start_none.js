cwt.Gameflow.addState({
  id:"NONE",

  init: function () {
    this.backgroundDrawn = false;
  },

  update: function (delta) {
    if (this.backgroundDrawn) {
      cwt.Gameflow.changeState("LOADING_SCREEN");
    }
  },

  render: function () {
    if (!this.backgroundDrawn) {
      var ctx = cwt.Screen.layerBG.getContext();

      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, cwt.Screen.width, cwt.Screen.height);

      this.backgroundDrawn = true;
    }
  }
});