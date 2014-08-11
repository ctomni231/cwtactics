"use strict";

var TOOLTIP_TIME = 10000;

var tooltip_time = TOOLTIP_TIME;

var background = null;

var tooltip = new cwt.UIField(
  parseInt(cwt.Screen.width * 0.1, 10),
  parseInt(cwt.Screen.height * 0.2, 10),
  parseInt(cwt.Screen.width * 0.8, 10),
  120,
  "",
  10,
  cwt.UIField.STYLE_NORMAL
);

var button = new cwt.UIField(
  parseInt(cwt.Screen.width * 0.5 - 150, 10),
  parseInt(cwt.Screen.height * 0.8, 10) - 20,
  300,
  40,
  "START",
  20,
  cwt.UIField.STYLE_NORMAL
);

exports.state = {
  id: "START_SCREEN",

  enter: function () {
    this.renderer.layerUI.clear();

    // select a random background image
    var numBackgrounds = this.image.sprites.BACKGROUNDS.getNumberOfImages();
    var randBGIndex = parseInt(Math.random() * numBackgrounds, 10);
    background = this.image.sprites.BACKGROUNDS.getImage(randBGIndex);
  },

  update: function (delta, lastInput) {

    // action leads into main menu
    if (lastInput && lastInput.key === this.input.TYPE_ACTION) {
      this.audio.playNullSound();
      this.changeState("MAIN_MENU");

    } else {
      tooltip_time += delta;
      if (this.tooltip_time >= this.TOOLTIP_TIME) {

        // update random tooltip
        var randEl = cwt.Tooltips[parseInt(Math.random() * cwt.Tooltips.length, 10)];
        this.tooltip.text = cwt.Localization.forKey(randEl);

        if (this.tooltip.text.search(/\n/) !== -1) {
          this.tooltip.text = this.tooltip.text.split("\n");
        }

        tooltip_time = 0;
      }
    }
  },

  render: function () {
    if (background) {
      this.renderer.layerBG.getContext().drawImage(
        background, 0, 0, this.renderer.screenWidth, this.renderer.screenHeight);

      background = null;
    }

    var uiCtx = this.renderer.layerUI.getContext();
    button.draw(uiCtx);
    tooltip.draw(uiCtx);
  }
};