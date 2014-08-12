var constants = require("../constants");

var backgroundDrawn = false;

var renderer = require("../renderer");

exports.state = {
  id:"NONE",

  update: function () {
    if (backgroundDrawn) {
      this.changeState("LOADING_SCREEN");
    }
  },

  render: function () {
    if (!backgroundDrawn) {
      var ctx = renderer.layerBG.getContext(constants.INACTIVE);

      ctx.fillStyle = "gray";
      ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);

      backgroundDrawn = true;
    }
  }
};