package org.wolftec.wPlay.input;

import static org.stjs.javascript.JSObjectAdapter.$js;

import org.stjs.javascript.Array;
import org.wolftec.wCore.container.ContainerUtil;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;

@ManagedComponent
public class GamepadBackend implements InputBackend, ManagedComponentInitialization {

  public static final int INDEX_A = 0;
  public static final int INDEX_B = 1;
  public static final int INDEX_LEFT = 2;
  public static final int INDEX_RIGHT = 3;
  public static final int INDEX_UP = 4;
  public static final int INDEX_DOWN = 5;

  @Injected
  private LiveInputManager input;

  @ManagedConstruction
  private Logger p_log;

  private Array<Integer> p_prevTimestamps;
  private boolean p_vendorAPI;
  private boolean p_enabled;

  private Array<Boolean> p_pressed;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_vendorAPI = $js("(navigator.getGamepads === undefined)");

    p_pressed = ContainerUtil.createArray();
    ContainerUtil.fillArray(p_pressed, false, 6);
  }

  public void update(int delta) {
    if (p_enabled) {

      Array<?> gamePads = $js("p_vendorAPI ? navigator.webkitGetGamepads() : navigator.getGamepads()");
      for (int i = 0, e = 4; i < e; i++) {
        Object gamePad = $js("gamePads[i]");
        if (gamePad != null) {

          // check time stamps to prevent registering one physical button press
          // as multiple engine clicks
          boolean sameSlot = $js("p_prevTimestamps[i] == gamePad.timestamp");
          if (!sameSlot) {

            p_prevTimestamps.$set(i, $js("gamePad.timestamp"));

            Array<Integer> buttons = $js("gamePad.buttons");
            Array<Integer> axes = $js("gamePad.axes");

            checkButton(buttons.$get(0) == 1, INDEX_A, InputTypes.BUTTON_A);
            checkButton(buttons.$get(1) == 1, INDEX_B, InputTypes.BUTTON_B);
            checkButton(axes.$get(1) < -0.5, INDEX_UP, InputTypes.DPAD_UP);
            checkButton(axes.$get(1) > +0.5, INDEX_DOWN, InputTypes.DPAD_DOWN);
            checkButton(axes.$get(0) < -0.5, INDEX_LEFT, InputTypes.DPAD_LEFT);
            checkButton(axes.$get(0) > +0.5, INDEX_RIGHT, InputTypes.DPAD_RIGHT);
          }
        }
      }
    }
  }

  private void checkButton(boolean pressed, int buttonIndex, String key) {
    if (pressed) {
      if (!p_pressed.$get(buttonIndex)) {
        input.keyPressed(key);
        p_pressed.$set(buttonIndex, true);
      }
    } else {
      if (p_pressed.$get(buttonIndex)) {
        input.keyReleased(key);
        p_pressed.$set(buttonIndex, false);
      }
    }
  }

  @Override
  public void enable() {
    p_log.info("enable gamepad input");
    p_enabled = true;
  }

  @Override
  public void disable() {
    p_log.info("disable gamepad input");
    p_enabled = false;
  }
}
