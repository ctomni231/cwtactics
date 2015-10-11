package org.wolftec.cwt.core.input.backends.gamepad;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge class Gamedpad {
  int            timestamp;

  // TODO new specification shows different API
  // https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
  Array<Integer> buttons;

  Array<Integer> axes;
}