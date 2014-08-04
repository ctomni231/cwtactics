exports.state = {

  id: "CONFIRM_WIPE_OUT_SCREEN",

  last: "OPTIONS",

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w).addButton(16, 8, 0, "OPTIONS_WIPE_OUT_TEXT", cwt.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_NO", cwt.UIField.STYLE_NORMAL, function () {
        require("../statemachine").changeState("OPTIONS");
      })
      .addColGap(4)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_YES", cwt.UIField.STYLE_NORMAL, function () {
        cwt.Storage.wipeOutAll(function () {
          delete localStorage.cwt_hasCache;
          document.location.reload();
        });
      });
  }
};