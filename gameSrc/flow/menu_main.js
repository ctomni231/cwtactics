cwt.ButtonFlowState({

  id: "MAIN_MENU",
  last: "START_SCREEN",

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 16) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", 20, function () {
        cwt.Gameflow.changeState("VERSUS");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_NETWORK", 20)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", 20, function () {
        cwt.Gameflow.changeState("OPTIONS");
      });
  }
});