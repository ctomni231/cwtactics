package org.wolftec.cwt.input;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.core.Deactivatable;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.system.Nullable;

public class GamepadInput implements Injectable, Deactivatable {

  @STJSBridge
  @GlobalScope
  static class GlobalGamepad {
    native static Array<Gamedpad> webkitGetGamepads();
  }

  @STJSBridge
  static class Gamedpad {
    int            timestamp;

    // TODO new specification shows different API
    // https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
    Array<Integer> buttons;

    Array<Integer> axes;
  }

  private InputManager   input;

  private boolean        enabled;
  private Array<Integer> prevTimestamps;

  private void checkButton(Gamedpad gamepad, int id) {
    String button = "GAMEPAD_" + id;

    if (gamepad.buttons.$get(id) == 1) {
      input.pressButton(button);
    } else {
      input.releaseButton(button);
    }
  }

  private void checkAxis(Gamedpad gamepad, int id, String negativeButton, String positiveButton) {
    Integer value = gamepad.axes.$get(id);
    if (value < -0.5) {
      input.releaseButton(positiveButton);
      input.pressButton(negativeButton);

    } else if (value > +0.5) {
      input.releaseButton(negativeButton);
      input.pressButton(positiveButton);

    } else {
      input.releaseButton(negativeButton);
      input.releaseButton(positiveButton);
    }
  }

  public void checkData() {
    if (!enabled) {
      return;
    }

    Array<Gamedpad> gamepads = GlobalGamepad.webkitGetGamepads();

    for (int i = 0; i < 4; i++) {
      Gamedpad gamepad = gamepads.$get(i);
      if (!Nullable.isPresent(gamepad)) continue;

      if (Nullable.getOrElse(prevTimestamps.$get(i), 0) == gamepad.timestamp) continue;
      prevTimestamps.$set(i, gamepad.timestamp);

      checkButton(gamepad, 0);
      checkButton(gamepad, 1);
      checkButton(gamepad, 2);
      checkButton(gamepad, 3);
      checkAxis(gamepad, 0, "GAMEPAD_LEFT", "GAMEPAD_RIGHT");
      checkAxis(gamepad, 1, "GAMEPAD_UP", "GAMEPAD_DOWN");
    }
  }

  @Override
  public void enable() {
    enabled = true;
  }

  @Override
  public void disable() {
    enabled = false;
  }

}
