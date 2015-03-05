package org.wolfTec.wolfTecEngine.input;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolfTec.managed.ComponentManager;
import org.wolfTec.managed.Injected;
import org.wolfTec.managed.ManagedComponent;
import org.wolfTec.managed.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.JsExec;

@ManagedComponent(whenQualifier="keyboard_input=WOLFTEC")
public class KeyboardBackend implements InputBackend, ManagedComponentInitialization {

  public final int CONSOLE_TOGGLE_KEY = 192;

  @Injected
  private InputManager input;

  private boolean p_enabled;
  private Logger p_log;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_log = manager.getComponentByClass(LogManager.class).createByClass(getClass());

    Function1<Integer, String> getInputType = (keycode) -> {
      switch (keycode) { // TODO make generic

        case 37:
          return InputTypes.DPAD_LEFT;
        case 38:
          return InputTypes.DPAD_UP;
        case 39:
          return InputTypes.DPAD_RIGHT;
        case 40:
          return InputTypes.DPAD_DOWN;
        case 13:
          return InputTypes.BUTTON_A;
        case 8:
          return InputTypes.BUTTON_B;

        default:
          break;
      }
      
      p_log.error("Cannot convert keycode " + keycode + " to an known input type");
      return null;
    };

    Function1<DOMEvent, Boolean> onKeyDown = (DOMEvent event) -> {
      if (p_enabled) {
        input.keyPressed(getInputType.$invoke(JsExec.injectJS("event.keyCode")));
      }
      return false;
    };

    Function1<DOMEvent, Boolean> onKeyUp = (DOMEvent event) -> {
      if (p_enabled) {
        input.keyReleased(getInputType.$invoke(JsExec.injectJS("event.keyCode")));
      }
      return false;
    };

    JSObjectAdapter.$js("targetElement.onkeydown = onKeyDown");
    JSObjectAdapter.$js("targetElement.onkeyup = onKeyUp");
  }

  @Override
  public void enable() {
    p_log.info("disable keyboard input");
    p_enabled = true;
  }

  @Override
  public void disable() {
    p_log.info("disable keyboard input");
    p_enabled = false;
  }
}
