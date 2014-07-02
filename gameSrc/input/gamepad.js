cwt.Input.create("gamePad", function () {

  // not supported ?
  if (!cwt.ClientFeatures.gamePad) {
    return;
  }

  var prevTimestamps = [];
  var that = this;

  that.MAPPING = {
    ACTION: 0,
    CANCEL: 1
  };

  this.update = function () {
    var gamePads = navigator.webkitGetGamepads();

    for (var i = 0, e = 4; i < e; i++) {
      var gamePad = gamePads[i];
      if (!gamePad) continue;

      // check_ timestamp
      if (prevTimestamps[i] && (gamePad.timestamp == prevTimestamps[i])) continue;
      prevTimestamps[i] = gamePad.timestamp;

      // in key mapping
      if (cwt.Input.genericInput) {
        if (cwt.Gameflow.activeState.mode != 1) {
          return;
        }

        var code = -1;

        // grab key code of the pressed button
        if (gamePad.elements[0] === 1) code = 0;
        else if (gamePad.elements[1] === 1) code = 1;
        else if (gamePad.elements[2] === 1) code = 2;
        else if (gamePad.elements[3] === 1) code = 3;
        else if (gamePad.elements[4] === 1) code = 4;
        else if (gamePad.elements[5] === 1) code = 5;
        else if (gamePad.elements[6] === 1) code = 6;
        else if (gamePad.elements[7] === 1) code = 7;
        else if (gamePad.elements[8] === 1) code = 8;
        else if (gamePad.elements[9] === 1) code = 9;
        else if (gamePad.elements[10] === 1) code = 10;
        else if (gamePad.elements[11] === 1) code = 11;
        else if (gamePad.elements[12] === 1) code = 12;
        else if (gamePad.elements[13] === 1) code = 13;

        if (code > -1) {
          cwt.Gameflow.activeState.genericInput(code);
        }
      } else {
        var key = null;

        // try to extract key
        if (gamePad.buttons[that.MAPPING.ACTION] === 1) {
          key = cwt.Input.TYPE_ACTION;

        } else if (gamePad.buttons[that.MAPPING.CANCEL] === 1) {
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