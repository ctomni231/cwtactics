var constants = require("../constants");

var backgroundDrawn = false;

exports.state = {
  id:"NONE",

  update: function () {
    if (backgroundDrawn) {
      require("../statemachine").changeState("LOADING_SCREEN");
    }
  },

  render: function () {
    if (!backgroundDrawn) {
      var ctx = this.renderer.layerBG.getContext(constants.INACTIVE);

      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, this.renderer.screenWidth, this.renderer.screenHeight);

      backgroundDrawn = true;
    }
  }
};