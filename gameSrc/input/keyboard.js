cwt.Input.create("keyboard", function () {
  var that = this;

  var CONSOLE_TOGGLE_KEY = 192;

  // not supported ?
  if (!cwt.ClientFeatures.keyboard) {
    return;
  }

  that.MAPPING = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ACTION: 13,
    CANCEL: 8
  };

  // register key down listener
  document.onkeydown = function (ev) {
    var key = cwt.INACTIVE;

    if (cwt.Gameflow.state === "REMAP_KEYBOARD") {
      cwt.Input.pushAction(cwt.Input.TYPE_SET_INPUT, ev.keyCode, cwt.INACTIVE);

    } else {

      // extract code
      switch (ev.keyCode) {

        case CONSOLE_TOGGLE_KEY:
          console.toggle();
          break;

        case that.MAPPING.LEFT:
          key = cwt.Input.TYPE_LEFT;
          break;

        case that.MAPPING.UP:
          key = cwt.Input.TYPE_UP;
          break;

        case that.MAPPING.RIGHT:
          key = cwt.Input.TYPE_RIGHT;
          break;

        case that.MAPPING.DOWN:
          key = cwt.Input.TYPE_DOWN;
          break;

        case that.MAPPING.CANCEL:
          key = cwt.Input.TYPE_CANCEL;
          break;

        case that.MAPPING.ACTION:
          key = cwt.Input.TYPE_ACTION;
          break;
      }

      // push key into input stack
      if (key !== cwt.INACTIVE) {
        cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
      }
    }
  };
});