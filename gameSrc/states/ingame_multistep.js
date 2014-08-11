exports.state = {
  id: "INGAME_MULTISTEP_IDLE",

  enter: function () {
    this.globalData.inMultiStep = false;
  }
};