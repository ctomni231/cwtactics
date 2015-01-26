package net.wolfTec.wtEngine.input.impl;

import net.wolfTec.cwt.Constants;
import net.wolfTec.cwt.Game;
import net.wolfTec.wtEngine.base.PostEngineInitializationListener;
import net.wolfTec.wtEngine.input.InputBackend;
import net.wolfTec.wtEngine.input.InputBackendType;
import net.wolfTec.wtEngine.input.InputBean;
import net.wolfTec.wtEngine.input.InputTypeKey;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.statemachine.StateMachineBean;

import org.stjs.javascript.*;

import static org.stjs.javascript.JSObjectAdapter.*;

public class GamePadInputBean implements InputBackend, PostEngineInitializationListener {

  private boolean vendorAPI;

  private Logger log;
  private InputBean input;
  private StateMachineBean stm;

  private Map<String, Integer> GAMEPAD_MAPPING;

  private boolean enabled;

  private final Array<Integer> prevTimestamps = JSCollections.$array();
  
  @Override public void onPostEngineInit() {

    // register default mapping
    GAMEPAD_MAPPING = JSCollections.$map();
    GAMEPAD_MAPPING.$put(InputTypeKey.A.name(), 0);
    GAMEPAD_MAPPING.$put(InputTypeKey.B.name(), 1);

    vendorAPI = $js("(navigator.getGamepads === undefined)");
  }

  @Override public Map<String, Integer> getKeyMap() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override public void update(int delta) {
    if (enabled) {

      Array<?> gamePads = $js("vendorAPI ? navigator.webkitGetGamepads() : navigator.getGamepads()");
      for (int i = 0, e = 4; i < e; i++) {
        Object gamePad = $js("gamePads[i]");
        if (gamePad != null) {

          // check time stamps to prevent registering one physical button press
          // as multiple engine clicks
          boolean sameSlot = $js("prevTimestamps[i] == gamePad.timestamp");
          if (!sameSlot) {
            prevTimestamps.$set(i, $js("gamePad.timestamp"));
            if (input.genericInput) {
              handleGenericInput(gamePad);
            } else {
              handleInput(gamePad);
            }
          }
        }
      }
    }
  }

  private void handleGenericInput(Object gamePad) {
    // TODO: if (net.wolfTec.activeState.mode != 1) { return; }

    Array<Integer> elements = $js("gamePad.elements");
    for (int i = 0; i < 13; i++) {
      if (elements.$get(i) == 1) {
        stm.activeState().genericInput(InputBackendType.GAMEPAD, i);
        return;
      }
    }
  }

  private void handleInput(Object gamePad) {
    InputTypeKey key = null;
    Array<Integer> buttons = $js("gamePad.buttons");
    Array<Integer> axes = $js("gamePad.axes");

    // try to extract key
    if (buttons.$get(GAMEPAD_MAPPING.$get("A")) == 1) {
      key = InputTypeKey.A;

    } else if (buttons.$get(GAMEPAD_MAPPING.$get("B")) == 1) {
      key = InputTypeKey.B;

    } else if (axes.$get(1) < -0.5) {
      key = InputTypeKey.UP;

    } else if (axes.$get(1) > +0.5) {
      key = InputTypeKey.DOWN;

    } else if (axes.$get(0) < -0.5) {
      key = InputTypeKey.LEFT;

    } else if (axes.$get(0) > +0.5) {
      key = InputTypeKey.RIGHT;
    }

    // invoke input event when a known key was pressed
    if (key != null) {
      input.pushAction(key, Constants.INACTIVE_ID, Constants.INACTIVE_ID);
    }
  }

  @Override public void enable() {
    log.info("enable gamepad input");
    enabled = true;
  }

  @Override public void disable() {
    log.info("disable gamepad input");
    enabled = false;
  }
}