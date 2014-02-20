cwt.Input.define("keyboard",function(){

  // not supported ?
  if( !cwt.ClientFeatures.keyboard ){
    this.disabled = true;
    return;
  }

  var input = this;

  document.onkeydown = function (ev) {
    if( input.disabled ) return false;

    if( controller.input_blocked ) return false;

    // in key mapping
    if (controller.input_genericInputRequest &&
      controller.screenStateMachine.state === "REMAP_KEYBOARD") {
      controller.screenStateMachine.event("INPUT_SET", ev.keyCode);
    } else {

      var key = null;
      var keymap = controller.keyMaps.KEYBOARD;
      switch (ev.keyCode) {

        // +++++++++++++++++++++ d-pad +++++++++++++++++++++++

        case keymap.LEFT:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.LEFT; break;

        case keymap.UP:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.UP; break;

        case keymap.RIGHT:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.RIGHT; break;

        case keymap.DOWN:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.DOWN; break;

        // +++++++++++++++++++++ actions +++++++++++++++++++++

        case keymap.CANCEL:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.CANCEL; break;

        case keymap.ACTION:
          key = controller.DEFAULT_KEY_MAP.KEYBOARD.ACTION; break;
      }
    }

    if( key !== null ) controller.input_pushKey( key, INACTIVE_ID, INACTIVE_ID  );
    return false;
  };


});