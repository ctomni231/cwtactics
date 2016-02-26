util.scoped(function() {
  controller.setupKeyboardControls = function(canvas, menuEl) {
    if (DEBUG) util.log("initializing keyboard support");

    document.onkeypress = function(ev) {

      var keymap = controller.keyMaps.KEYBOARD;
      switch (ev.keyCode) {

        case keymap.LEFT:
          cwt.input_press_key("KEY_LEFT");
          break;
        case keymap.UP:
          cwt.input_press_key("KEY_UP");
          break;
        case keymap.RIGHT:
          cwt.input_press_key("KEY_RIGHT");
          break;
        case keymap.DOWN:
          cwt.input_press_key("KEY_DOWN");
          break;
        case keymap.CANCEL:
          cwt.input_press_key("KEY_ENTER"); // TODO 
          break;
        case keymap.ACTION:
          cwt.input_press_key("KEY_CTRL"); // TODO 
          break;
      }
    };

    document.onkeydown = function(ev) {

      // in key mapping
      if (controller.activeMapping !== null && controller.activeMapping === controller.KEY_MAPPINGS.KEYBOARD) {
        controller.screenStateMachine.event("INPUT_SET", ev.keyCode);
      } else {
        var keymap = controller.keyMaps.KEYBOARD;
        switch (ev.keyCode) {

          // +++++++++++++++++++++ d-pad +++++++++++++++++++++++

          case keymap.LEFT:
            controller.screenStateMachine.event("INP_LEFT", 1);
            return false;

          case keymap.UP:
            controller.screenStateMachine.event("INP_UP", 1);
            return false;

          case keymap.RIGHT:
            controller.screenStateMachine.event("INP_RIGHT", 1);
            return false;

          case keymap.DOWN:
            controller.screenStateMachine.event("INP_DOWN", 1);
            return false;

            // +++++++++++++++++++++ actions +++++++++++++++++++++

          case keymap.CANCEL:
            controller.screenStateMachine.event("INP_CANCEL");
            return false;

          case keymap.ACTION:
            controller.screenStateMachine.event("INP_ACTION");
            return false;
        }
      }

      return false;
    };

    document.onkeyup = function(ev) {

      var keymap = controller.keyMaps.KEYBOARD;
      switch (ev.keyCode) {

        case keymap.LEFT:
          cwt.input_release_key("KEY_LEFT");
          break;
        case keymap.UP:
          cwt.input_release_key("KEY_UP");
          break;
        case keymap.RIGHT:
          cwt.input_release_key("KEY_RIGHT");
          break;
        case keymap.DOWN:
          cwt.input_release_key("KEY_DOWN");
          break;
        case keymap.CANCEL:
          cwt.input_release_key("KEY_ENTER"); // TODO 
          break;
        case keymap.ACTION:
          cwt.input_release_key("KEY_CTRL"); // TODO 
          break;
      }

      return false;
    };

  };
});