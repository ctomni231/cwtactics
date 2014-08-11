"use strict";

var TOOLTIP_TIME = 10000;

exports.tooltips = null;

var constants = require("../constants");
var widgets = require("../uiWidgets");
var renderer = require("../renderer");
var i18n = require("../localization");

var tooltip_time = TOOLTIP_TIME;

var background = null;

var tooltip = new widgets.UIField(
  parseInt(renderer.screenWidth * 0.1, 10),
  parseInt(renderer.screenHeight * 0.2, 10),
  parseInt(renderer.screenWidth * 0.8, 10),
  120,
  "",
  10,
  widgets.UIField.STYLE_NORMAL
);

var button = new widgets.UIField(
  parseInt(renderer.screenWidth * 0.5 - 150, 10),
  parseInt(renderer.screenHeight * 0.8, 10) - 20,
  300,
  40,
  "START",
  20,
  widgets.UIField.STYLE_NORMAL
);

exports.state = {
  id: "START_SCREEN",

  enter: function () {
    renderer.layerUI.clear(constants.INACTIVE);

    // select a random background image
    var numBackgrounds = this.image.sprites["BACKGROUNDS"].getNumberOfImages();
    var randBGIndex = parseInt(Math.random() * numBackgrounds, 10);
    background = this.image.sprites["BACKGROUNDS"].getImage(randBGIndex);
  },

  update: function (delta, lastInput) {

    // action leads into main menu
    if (lastInput && lastInput.key === this.input.TYPE_ACTION) {
      this.audio.playNullSound();
      this.changeState("MAIN_MENU");

    } else {
      tooltip_time += delta;
      if (this.tooltip_time >= this.TOOLTIP_TIME) {

        if (exports.tooltips) {

          // update random tooltip
          var randEl = exports.tooltips[parseInt(Math.random() * exports.tooltips.length, 10)];
          tooltip.text = i18n.forKey(randEl);

          if (tooltip.text.search(/\n/) !== -1) {
            tooltip.text = this.tooltip.text.split("\n");
          }
        }

        tooltip_time = 0;
      }
    }
  },

  render: function () {
    if (background) {
      this.renderer.layerBG.getContext(constants.INACTIVE).drawImage(
        background,
        0, 0,
        this.renderer.screenWidth,
        this.renderer.screenHeight);

      background = null;
    }

    var uiCtx = this.renderer.layerUI.getContext(constants.INACTIVE);
    button.draw(uiCtx);
    tooltip.draw(uiCtx);
  }
};