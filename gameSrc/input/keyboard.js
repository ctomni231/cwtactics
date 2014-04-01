cwt.Input.create("keyboard", function () {

  // not supported ?
  if (!cwt.ClientFeatures.keyboard) {
    return;
  }

  this.MAPPING = {
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

        case this.MAPPING.LEFT:
          key = cwt.Input.TYPE_LEFT;
          break;

        case this.MAPPING.UP:
          key = cwt.Input.TYPE_UP;
          break;

        case this.MAPPING.RIGHT:
          key = cwt.Input.TYPE_RIGHT;
          break;

        case this.MAPPING.DOWN:
          key = cwt.Input.TYPE_DOWN;
          break;

        case this.MAPPING.CANCEL:
          key = cwt.Input.TYPE_CANCEL;
          break;

        case this.MAPPING.ACTION:
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