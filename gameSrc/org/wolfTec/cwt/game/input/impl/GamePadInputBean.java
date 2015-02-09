package org.wolfTec.cwt.game.input.impl;

import org.stjs.javascript.*;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.Game;
import org.wolfTec.cwt.game.input.InputBackend;
import org.wolfTec.cwt.game.input.InputBackendType;
import org.wolfTec.cwt.game.input.InputBean;
import org.wolfTec.cwt.game.input.InputMappable;
import org.wolfTec.cwt.game.input.InputTypeKey;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.statemachine.StateMachineBean;
import org.wolfTec.cwt.utility.Bean;
import org.wolfTec.cwt.utility.BeanFactory;
import org.wolfTec.cwt.utility.Injected;
import org.wolfTec.cwt.utility.InjectedByFactory;
import org.wolfTec.cwt.utility.PostInitialization;

import static org.stjs.javascript.JSObjectAdapter.*;

@Bean public class GamePadInputBean implements InputBackend, InputMappable {

  private boolean vendorAPI;

  @InjectedByFactory private Logger log;
  @Injected private InputBean input;
  @Injected private StateMachineBean stm;

  private Map<String, Integer> mapping;

  private boolean enabled;

  private final Array<Integer> prevTimestamps = JSCollections.$array();
  
  @PostInitialization public void init(BeanFactory engine) {

    // register default mapping
    mapping = JSCollections.$map();
    mapping.$put(InputTypeKey.A.name(), 0);
    mapping.$put(InputTypeKey.B.name(), 1);

    vendorAPI = $js("(navigator.getGamepads === undefined)");
  }

  @Override public Map<String, Integer> getInputMapping() {
    return mapping;
  }
  
  @Override public String getInputMappingName() {
    return "gamepad";
  }
  
  @Override public void setInputMapping(Map<String, Integer> map) {
    mapping = map;
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
    if (buttons.$get(mapping.$get("A")) == 1) {
      key = InputTypeKey.A;

    } else if (buttons.$get(mapping.$get("B")) == 1) {
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
  
  public void saveConfig (Callback0 callback) {
    
  }
  
  public void loadConfig (Callback0 callback) {
    
  }
}