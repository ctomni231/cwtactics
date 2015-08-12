package org.wolftec.cwt.input.backends.gamepad;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge class Navigator {
  native Array<Gamedpad> getGamepads();
}