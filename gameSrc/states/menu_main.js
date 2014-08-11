exports.state = {

  id: "MAIN_MENU",

  last: "START_SCREEN",

  doLayout: function (layout) {
    var h = parseInt((cwt.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", cwt.UIField.STYLE_NORMAL, 20, function () {
        require("../statemachine").changeState("VERSUS");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_NETWORK", cwt.UIField.STYLE_NORMAL, 20 )
      .breakLine()

      //--------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", cwt.UIField.STYLE_NEW, 20, function () {
        require("../statemachine").changeState("WEATHER");
      })
      .breakLine()
      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", cwt.UIField.STYLE_ESW, 20, function () {
        require("../statemachine").changeState("RAIN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", cwt.UIField.STYLE_NORMAL, 20, function () {
        require("../statemachine").changeState("OPTIONS");
      });
  }
};