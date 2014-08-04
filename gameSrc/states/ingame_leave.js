var renderer = require("../renderer");
var constants = require("../constants");

exports.state = {
  id: "INGAME_LEAVE",

  enter: function () {
    this.data.inGameRound = false;
    renderer.showNativeCursor();

    if (constants.DEBUG) console.log("exiting game round");
  }
};