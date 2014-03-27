cwt.Gameflow.addState({
  id:"NONE",

  init: function () {
    this.backgroundDrawn = false;
  },

  update: function () {
    if (this.backgroundDrawn) {
      cwt.Gameflow.changeState("LOADING_SCREEN");
    }
  },

  draw: function () {
    if (!this.backgroundDrawn) {
      var ctxBg = cwt.Screen.backgroundLayer.getContext(0);

      ctxBg.fillStyle = "green";
      ctxBg.fillRect(0, 0, cwt.Screen.canvas_width, cwt.Screen.canvas_height);

      this.backgroundDrawn = true;
    }
  }
});