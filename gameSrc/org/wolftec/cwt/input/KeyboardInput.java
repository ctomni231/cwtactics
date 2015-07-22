package org.wolftec.cwt.input;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;

public class KeyboardInput implements InputBackend {

  public static final int      CONSOLE_TOGGLE_KEY = 192;

  private Map<String, Integer> mapping;

  public KeyboardInput() {
    mapping.$put("UP", 38);
    mapping.$put("DOWN", 40);
    mapping.$put("LEFT", 37);
    mapping.$put("RIGHT", 39);
    mapping.$put("ACTION", 13);
    mapping.$put("CANCEL", 8);
  }

  @STJSBridge
  public class KeyEvent {
    int keyCode;
  }

  public void handleEvent(KeyEvent ev) {
    int key = Constants.INACTIVE;
    /*
     * if (input.wantsGenericInput()) { if (state.activeState.mode !== 0) {
     * return; }
     * 
     * // TODO state.activeState.genericInput(ev.keyCode);
     * 
     * } else {
     * 
     * // extract code switch (ev.keyCode) {
     * 
     * case CONSOLE_TOGGLE_KEY: JSObjectAdapter.$js("console.toggle()"); break;
     * 
     * case "LEFT": key = input.TYPE_LEFT; break;
     * 
     * case "UP": key = input.TYPE_UP; break;
     * 
     * case MAPPING.RIGHT: key = input.TYPE_RIGHT; break;
     * 
     * case MAPPING.DOWN: key = input.TYPE_DOWN; break;
     * 
     * case MAPPING.CANCEL: key = input.TYPE_CANCEL; break;
     * 
     * case MAPPING.ACTION: key = input.TYPE_ACTION; break; }
     * 
     * // push key into input stack if (key != Constants.INACTIVE) {
     * input.pushAction(key, Constants.INACTIVE, Constants.INACTIVE); } }
     */
  }

  @Override
  public void enable() {
    Callback1<KeyEvent> handler = this::handleEvent;
    JSObjectAdapter.$put(Global.window.document, "onkeydown", handler);
  }

  @Override
  public void disable() {
    JSObjectAdapter.$put(Global.window.document, "onkeydown", null);
  }

  @Override
  public Map<String, Integer> getMapping() {
    return mapping;
  }

}
