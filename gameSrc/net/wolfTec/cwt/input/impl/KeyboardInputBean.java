package net.wolfTec.cwt.input.impl;

import net.wolfTec.cwt.input.*;
import net.wolfTec.cwt.log.Logger;
import net.wolfTec.cwt.statemachine.StateMachineBean;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Function1;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.BeanFactory;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.InjectedByFactory;
import org.wolfTec.utility.PostInitialization;

@Bean public class KeyboardInputBean implements InputBackend, InputMappable {

  public final int CONSOLE_TOGGLE_KEY = 192;

  @InjectedByFactory private Logger log;
  @Injected private InputBean input;
  @Injected private StateMachineBean stm;

  private Map<String, Integer> mapping;
  
  private Function1<DOMEvent, Boolean> keyboardHandler;

  @PostInitialization public void init(BeanFactory engine) {

    // add default mapping
    mapping = JSCollections.$map();
    mapping.$put(InputTypeKey.UP.name(), 38);
    mapping.$put(InputTypeKey.DOWN.name(), 40);
    mapping.$put(InputTypeKey.LEFT.name(), 37);
    mapping.$put(InputTypeKey.RIGHT.name(), 39);
    mapping.$put(InputTypeKey.A.name(), 13);
    mapping.$put(InputTypeKey.B.name(), 8);
    
    keyboardHandler = (event) -> {
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
              input.pushAction(type, -1, -1);
              return true;
            }
          }
        }
      }
      return false;
    };
  }

  @Override public Map<String, Integer> getInputMapping() {
    return mapping;
  }
  
  @Override public String getInputMappingName() {
    return "keyboard";
  }
  
  @Override public void setInputMapping(Map<String, Integer> map) {
    mapping = map;
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
