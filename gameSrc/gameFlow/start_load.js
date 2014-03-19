cwt.Gameflow.addState({
  id: "LOADING_SCREEN",

  init: function () {
    this.bar = new cwt.LoadingBar(10, 10, cwt.Screen.width - 20, cwt.Screen.height - 20);
  },

  enter: function () {
    this.bar.setPercentage(0);

    cwt.Gameflow.changeState("START_SCREEN");
  },

  update: function (delta, lastInput) {
  },

  render: function (delta) {
    var ctxUI = cwt.Screen.interfaceLayer;

    // render bar
    this.bar.erase(ctxUI);
    this.bar.draw(ctxUI);
  }
});