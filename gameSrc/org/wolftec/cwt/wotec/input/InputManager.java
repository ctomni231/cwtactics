package org.wolftec.cwt.wotec.input;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.ObjectUtil;
import org.wolftec.cwt.wotec.ioc.Injectable;

public class InputManager implements Injectable, InputProvider {

  private static final String NOTHING_MAPPED = "NONE";
  private Map<String, Integer> actionState;
  private Map<String, Boolean> buttonState;
  private Map<String, String> buttonMapping;

  @Override
  public void onConstruction() {
    actionState = JSCollections.$map();
    buttonState = JSCollections.$map();
    buttonMapping = JSCollections.$map();
  }

  @Override
  public boolean isActionPressed(String action) {
    return NullUtil.getOrElse(actionState.$get(action), 0) > 0;
  }

  @Override
  public boolean isButtonPressed(String button) {
    return NullUtil.getOrElse(buttonState.$get(button), false);
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
        actionState.$put(action, NullUtil.getOrElse(actionState.$get(action), 0) + (status ? 1 : -1));
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

    boolean pressed = NullUtil.getOrElse(buttonState.$get(button), false);

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
    ObjectUtil.forEachMapValue(buttonMapping, itCb);
  }

  public void releaseButtonMapping(String button) {
    setButtonMapping(button, NOTHING_MAPPED);
  }

}
