package net.wolfTec.wtEngine.input.impl;

import net.wolfTec.cwt.Constants;
import net.wolfTec.wtEngine.base.PostEngineInitializationListener;
import net.wolfTec.wtEngine.input.InputBackend;
import net.wolfTec.wtEngine.input.InputBackendType;
import net.wolfTec.wtEngine.input.InputBean;
import net.wolfTec.wtEngine.input.InputTypeKey;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.statemachine.StateMachineBean;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;

public class KeyboardInputBean implements InputBackend, PostEngineInitializationListener {

  public final int CONSOLE_TOGGLE_KEY = 192;

  private Logger log;
  private InputBean input;
  private StateMachineBean stm;

  private Map<String, Integer> mapping;

  @Override public void onPostEngineInit() {

    // add default mapping
    mapping = JSCollections.$map();
    mapping.$put(InputTypeKey.UP.name(), 38);
    mapping.$put(InputTypeKey.DOWN.name(), 40);
    mapping.$put(InputTypeKey.LEFT.name(), 37);
    mapping.$put(InputTypeKey.RIGHT.name(), 39);
    mapping.$put(InputTypeKey.A.name(), 13);
    mapping.$put(InputTypeKey.B.name(), 8);
  }

  private final Function1<DOMEvent, Boolean> keyboardHandler = (event) -> {
    int keyCode = JSObjectAdapter.$js("event.keyCode");

    if (input.genericInput) {
      // TODO: if (stm.activeState().mode != 0) { return false; }
      stm.activeState().genericInput(InputBackendType.KEYBOARD, keyCode);

    } else {

      if (keyCode == CONSOLE_TOGGLE_KEY) {
        log.error("NotImplementedYet");

      } else {
        for (InputTypeKey type : InputTypeKey.values()) {
          if (mapping.$get(type.name()) == keyCode) {
            input.pushAction(type, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
            return true;
          }
        }
      }
    }
    return false;
  };

  @Override public Map<String, Integer> getKeyMap() {
    return mapping;
  }

  @Override public void enable() {
    log.info("disable keyboard input");
    JSObjectAdapter.$js("targetElement.onkeydown = this.keyboardHandler");
  }

  @Override public void disable() {
    log.info("disable keyboard input");
    JSObjectAdapter.$js("targetElement.onkeydown = null");
  }
}
