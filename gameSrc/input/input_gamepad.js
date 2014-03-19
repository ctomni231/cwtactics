cwt.Input.create("gamePad", function () {

  // not supported ?
  if (!cwt.ClientFeatures.gamePad) {
    return;
  }

  var prevTimestamps = [];

  this.MAPPING = {
    ACTION: 0,
    CANCEL: 1
  };

  this.update = function (canvas, menuEl) {
    var gamePads = navigator.webkitGetGamepads();

    for (var i = 0, e = 4; i < e; i++) {
      var gamePad = gamePads[i];
      if (!gamePad) continue;

      // check timestamp
      if (prevTimestamps[i] && (gamePad.timestamp == prevTimestamps[i])) continue;
      prevTimestamps[i] = gamePad.timestamp;

      // in key mapping
      if (cwt.Gameflow.state === "REMAP_GAMEPAD") {

        var code = -1;

        // grab key code of the pressed button
        if (gamePad.buttons[0] === 1) code = 0;
        else if (gamePad.buttons[1] === 1) code = 1;
        else if (gamePad.buttons[2] === 1) code = 2;
        else if (gamePad.buttons[3] === 1) code = 3;
        else if (gamePad.buttons[4] === 1) code = 4;
        else if (gamePad.buttons[5] === 1) code = 5;
        else if (gamePad.buttons[6] === 1) code = 6;
        else if (gamePad.buttons[7] === 1) code = 7;
        else if (gamePad.buttons[8] === 1) code = 8;
        else if (gamePad.buttons[9] === 1) code = 9;
        else if (gamePad.buttons[10] === 1) code = 10;
        else if (gamePad.buttons[11] === 1) code = 11;
        else if (gamePad.buttons[12] === 1) code = 12;
        else if (gamePad.buttons[13] === 1) code = 13;

        if (code > -1) {
          cwt.Input.pushAction(cwt.Input.TYPE_SET_INPUT, code, cwt.INACTIVE);
        }
      } else {
        var key = null;

        // try to extract key
        if (gamePad.buttons[MAPPING.ACTION] === 1) {
          key = cwt.Input.TYPE_ACTION;

        } else if (gamePad.buttons[MAPPING.CANCEL] === 1) {
          key = cwt.Input.TYPE_CANCEL;

        } else if (gamePad.axes[1] < -0.5) {
          key = cwt.Input.TYPE_UP;

        } else if (gamePad.axes[1] > +0.5) {
          key = cwt.Input.TYPE_DOWN;

        } else if (gamePad.axes[0] < -0.5) {
          key = cwt.Input.TYPE_LEFT;

        } else if (gamePad.axes[0] > +0.5) {
          key = cwt.Input.TYPE_RIGHT;
        }

        // invoke input event when a known key was pressed
        if (key) {
          cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
        }
      }
    }
  }
});