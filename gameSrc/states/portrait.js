/*
  The portrait screen will be used when the screen orientation changes
  to the portrait mode. Instead of changing the whole screen model we
  simply print a message "Return your device into the landscape mode".
//
require("../statemachine").addState({
  id: "PORTRAIT_SCREEN",

  init: function () {
    this.lastStateId = null;
  },

  enter: function (lastState) {
    this.rendered = false;
  },

  update: function (delta, lastInput) {
    var isLandscape = false;

    // go back to the last state when the device
    // is back in landscape mode (don't fire enter
    // event when changing back to the last state)
    if (isLandscape) {
      require("../statemachine").setState(this.lastStateId,false);
      this.lastStateId = null;
    }
  },

  render: function (delta) {
    if (!this.rendered) {
      var ctxUI = cwt.Screen.interfaceLayer.getContext();

      cwt.DrawUtil.cleanContext(ctxUI);

      this.rendered = true;
    }
  }
});