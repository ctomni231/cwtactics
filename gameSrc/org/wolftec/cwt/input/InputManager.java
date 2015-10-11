package org.wolftec.cwt.input;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.system.Option;

public class InputManager implements Injectable, InputProvider {

  private static final String  NOTHING_MAPPED = "NONE";
  private Map<String, Integer> actionState;
  private Map<String, Boolean> buttonState;
  private Map<String, String>  buttonMapping;

  @Override
  public void onConstruction() {
    actionState = JSCollections.$map();
    buttonState = JSCollections.$map();
    buttonMapping = JSCollections.$map();
  }

  @Override
  public boolean isActionPressed(String action) {
    return Option.ofNullable(actionState.$get(action)).orElse(0) > 0;
  }

  @Override
  public boolean isButtonPressed(String button) {
    return Option.ofNullable(buttonState.$get(button)).orElse(false);
  }

  /**
   * 
   * @param button
   */
  public void pressButton(String button) {
    changeStatus(button, true);
  }

  /**
   * @param button
   */
  public void releaseButton(String button) {
    changeStatus(button, false);
  }

  private void changeStatus(String button, boolean status) {
    if (buttonState.$get(button) != status) {
      buttonState.$put(button, status);

      String action = buttonMapping.$get(button);
      if (action != null) {
        actionState.$put(action, Option.ofNullable(actionState.$get(action)).orElse(0) + (status ? 1 : -1));
        if (actionState.$get(action) < 0) {
          // JsUtil.throwError("IllegalActionState: negative action counter
          // detected");
          actionState.$put(action, 0);
        }
      }
    }
  }

  public void setButtonMapping(String button, String action) {
    if (action == null || button == null) {
      JsUtil.throwError("IllegalArgumentException: null");
    }

    boolean pressed = Option.ofNullable(buttonState.$get(button)).orElse(false);

    /*
     * deactivate the button here to decrease the action counter of the previous
     * mapped action.
     */
    if (pressed) {
      changeStatus(button, false);
    }

    buttonMapping.$put(button, action);

    if (pressed) {
      changeStatus(button, true);
    }
  }

  @Override
  public void forEachButtonMapping(Callback2<String, String> itCb) {
    JsUtil.forEachMapValue(buttonMapping, itCb);
  }

  public void releaseButtonMapping(String button) {
    setButtonMapping(button, NOTHING_MAPPED);
  }

}
