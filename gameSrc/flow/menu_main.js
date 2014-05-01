cwt.ButtonFlowState({

  id: "MAIN_MENU",
  last: "START_SCREEN",

  init: function (layout) {

	//Just for the weather test, comment out when you need to :)
	var h = parseInt((cwt.SCREEN_HEIGHT - 22) / 2, 10);
	
	//var h = parseInt((cwt.SCREEN_HEIGHT - 16) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", cwt.UIField.STYLE_NORMAL, 20, function () {
        cwt.Gameflow.changeState("VERSUS");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_NETWORK", cwt.UIField.STYLE_NORMAL, 20)
      .breakLine()

	  //(Comment before here) Weather test!!!
	  //--------------------------------------------------------
	  
	  .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_TEST_WEATHER", cwt.UIField.STYLE_NORMAL, 20, function () {
        cwt.Gameflow.changeState("WEATHER");
      })
	  .breakLine()//*/
	  
	  // -------------------------------------------------------
	  
      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", cwt.UIField.STYLE_NORMAL, 20, function () {
        cwt.Gameflow.changeState("OPTIONS");
      });
  }
});