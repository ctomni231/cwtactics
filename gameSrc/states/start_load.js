require("../statemachine").addState({
  id: "LOADING_SCREEN",

  init: function () {
    this.bar = new cwt.LoadingBar(10, parseInt(cwt.Screen.height / 2, 10) - 10, cwt.Screen.width - 20, 20);
  },

  enter: function () {
    this.done = false;

    var bar = this.bar;
    cwt.Loading.startProcess(bar, function () {
      bar.setPercentage(100);
    });
  },

  update: function (delta, lastInput) {
    if (this.done) {

      // push event
      (cwt.createModuleCaller("$afterLoad"))();

      require("../statemachine").changeState("START_SCREEN");
    } else if (this.bar.process === 100) {
      this.done = true;
    }
  },

  render: function (delta) {
    var ctx = cwt.Screen.layerUI.getContext();

    this.bar.draw(ctx);
  }
});