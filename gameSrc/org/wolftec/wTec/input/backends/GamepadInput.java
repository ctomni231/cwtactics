package org.wolftec.wTec.input.backends;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.wTec.gameloop.FrameTickListener;
import org.wolftec.wTec.input.Deactivatable;
import org.wolftec.wTec.input.InputManager;
import org.wolftec.wTec.ioc.Injectable;
import org.wolftec.wTec.log.Log;

public class GamepadInput implements Injectable, Deactivatable, FrameTickListener {

  // --------------- game pad API ---------------
  // https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad

  @STJSBridge
  @GlobalScope
  static class Global {
    static Navigator navigator;
  }

  @STJSBridge
  static class Gamedpad {
    int timestamp;
    Array<Integer> buttons;
    Array<Integer> axes;
  }

  @STJSBridge
  static class Navigator {
    native Array<Gamedpad> getGamepads();
  }

  // --------------- game pad API ---------------

  private Log log;
  private InputManager input;

  private boolean enabled;
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

  @Override
  public void onFrameTick(int delta) {
    if (!enabled) {
      return;
    }

    Array<Gamedpad> gamepads = Global.navigator.getGamepads();

    for (int i = 0; i < 4; i++) {
      Gamedpad gamepad = gamepads.$get(i);
      if (!NullUtil.isPresent(gamepad)) {
        continue;
      }

      if (NullUtil.getOrElse(prevTimestamps.$get(i), 0) == gamepad.timestamp) continue;
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
    log.info("activating gamepad input");
    enabled = true;
  }

  @Override
  public void disable() {
    log.info("deactivating gamepad input");
    enabled = false;
  }

}
