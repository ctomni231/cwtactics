var renderer = require("../renderer");
var backgroundDrawn = false;

exports.state = {
  id:"NONE",

  update: function () {
    if (this.backgroundDrawn) {
      require("../statemachine").changeState("LOADING_SCREEN");
    }
  },

  render: function () {
    if (!backgroundDrawn) {
      var ctx = this.renderer.layerBG.getContext();

      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, this.renderer.screenWidth, this.renderer.screenHeight);

      backgroundDrawn = true;
    }
  }
};