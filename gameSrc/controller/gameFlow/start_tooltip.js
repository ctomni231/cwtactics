cwt.Gameflow.addState({
  id: "START_SCREEN",

  init: function () {
    this.TOOLTIP_TIME = 10000;
    this.tooltip_time = 0;
    this.background = null;
  },

  enter: function () {

    // 1. Pickup random background image
    this.background = null;
  },

  update: function (delta, lastInput) {

    // action leads into main menu
    if (lastInput === cwt.Input.TYPE_ACTION) {
      return "MAIN";
    }

    this.tooltip_time += delta;
    if (this.tooltip_time >= this.TOOLTIP_TIME) {

      // update random tooltip

      this.tooltip_time = 0;
    }
  },

  render: function () {

    // Draw background into layer 1
    if (this.background) {

      cwt.Screen.layer1Ctx.drawImage(
        this.background,
        0, 0,
        cwt.Screen.layer1Canvas.width,
        cwt.Screen.layer1Canvas.height);

      this.background = null;
    }
  }
});