"use strict";

var constants = require("../constants");
var widgets = require("../uiWidgets");

exports.state = {

  id: "MAIN_MENU",

  last: "START_SCREEN",

  doLayout: function (layout) {
    var h = parseInt((constants.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", widgets.UIField.STYLE_NORMAL, 20, function () {
        this.changeState("VERSUS");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_NETWORK", widgets.UIField.STYLE_NORMAL, 20 )
      .breakLine()

      //--------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", widgets.UIField.STYLE_NEW, 20, function () {
        this.changeState("WEATHER");
      })
      .breakLine()
      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", widgets.UIField.STYLE_ESW, 20, function () {
        this.changeState("RAIN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", widgets.UIField.STYLE_NORMAL, 20, function () {
        this.changeState("OPTIONS");
      });
  }
};