"use strict";

var constants = require("../constants");
var widgets = require("../uiWidgets");
var storage = require("../storage");

exports.state = {

  id: "CONFIRM_WIPE_OUT_SCREEN",

  last: "OPTIONS",

  doLayout: function (layout) {

    var h = parseInt((constants.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w).addButton(16, 8, 0, "OPTIONS_WIPE_OUT_TEXT", widgets.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_NO", widgets.UIField.STYLE_NORMAL, function () {
        this.changeState("OPTIONS");
      })
      .addColGap(4)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_YES", widgets.UIField.STYLE_NORMAL, function () {
        storage.clear(function() {
          document.location.reload();
        });
      });
  }
};