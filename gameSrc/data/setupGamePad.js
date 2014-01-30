util.scoped(function () {

  var enabled;

  // var gamepads = [];
  var prevTimestamps = [];

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  controller.setupGamePadControls = function (canvas, menuEl) {
    var chrome = !! navigator.webkitGetGamepads || !! navigator.webkitGamepads;
    if (chrome) {
      enabled = true;
    }
    else enabled = false;
  }

  controller.updateGamePadControls = function (canvas, menuEl) {
    if (!enabled) return;

    var gamepads = navigator.webkitGetGamepads();
    
    for (var i = 0, e = 4; i < e; i++) {
      var gamepad = gamepads[i];
      if (!gamepad) continue;

      // check timestamp
      if (prevTimestamps[i] && (gamepad.timestamp == prevTimestamps[i])) continue;
      prevTimestamps[i] = gamepad.timestamp;
      
      // blocked input ?
      if( controller.input_blocked ) return false;
      
      // in key mapping
      if ( controller.input_genericInputRequest && controller.screenStateMachine.state === "REMAP_GAMEPAD" ) {

        var code = -1;

        // grab key
        if (gamepad.buttons[0] === 1) code = 0;
        else if (gamepad.buttons[1] === 1) code = 1;
        else if (gamepad.buttons[2] === 1) code = 2;
        else if (gamepad.buttons[3] === 1) code = 3;
        else if (gamepad.buttons[4] === 1) code = 4;
        else if (gamepad.buttons[5] === 1) code = 5;
        else if (gamepad.buttons[6] === 1) code = 6;
        else if (gamepad.buttons[7] === 1) code = 7;
        else if (gamepad.buttons[8] === 1) code = 8;
        else if (gamepad.buttons[9] === 1) code = 9;
        else if (gamepad.buttons[10] === 1) code = 10;
        else if (gamepad.buttons[11] === 1) code = 11;
        else if (gamepad.buttons[12] === 1) code = 12;
        else if (gamepad.buttons[13] === 1) code = 13;

        if (code > -1) controller.screenStateMachine.event("INPUT_SET", code);
      } else {
        // extract triggered keys
        var keymap = controller.keyMaps.GAMEPAD;
        var keymapAct = controller.keyMaps.KEYBOARD;
        var key = null;

        // ++++++++++++++++++++++++++++++++ axis ++++++++++++++++++++++++++++++++++

        if (gamepad.axes[1] < -0.5)      key = keymapAct.UP;
        else if (gamepad.axes[1] > +0.5) key = keymapAct.DOWN;
        if (gamepad.axes[0] < -0.5)      key = keymapAct.LEFT;
        else if (gamepad.axes[0] > +0.5) key = keymapAct.RIGHT;

        // ++++++++++++++++++++++++++++++ actions +++++++++++++++++++++++++++++++++

        if (gamepad.buttons[keymap.ACTION] === 1)      key = keymapAct.ACTION;
        else if (gamepad.buttons[keymap.CANCEL] === 1) key = keymapAct.CANCEL;

        // invoke input event when a known key was pressed
        if (key) controller.input_pushKey( key, INACTIVE_ID, INACTIVE_ID  ); 
      }
    }
  }

});