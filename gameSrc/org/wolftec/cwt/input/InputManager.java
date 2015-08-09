package org.wolftec.cwt.input;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Nullable;

public class InputManager implements Injectable {

  private Map<String, Integer> actionState;
  private Map<String, Boolean> buttonState;
  private Map<String, String>  buttonMapping;

  public int                   lastX;
  public int                   lastY;

  @Override
  public void onConstruction() {
    actionState = JSCollections.$map();
    buttonState = JSCollections.$map();
    buttonMapping = JSCollections.$map();
  }

  /**
   * 
   * @param action
   * @return true if the given action is pressed, else false
   */
  public boolean isActionPressed(String action) {
    return Nullable.getOrElse(actionState.$get(action), 0) > 0;
  }

  /**
   * 
   * @param button
   * @return true if the given button is pressed, else false
   */
  public boolean isButtonPressed(String button) {
    return Nullable.getOrElse(buttonState.$get(button), false);
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
      if (Nullable.isPresent(action)) {
        actionState.$put(action, Nullable.getOrElse(actionState.$get(action), 0) + (status ? 1 : -1));
        if (actionState.$get(action) < 0) {
          JsUtil.throwError("IllegalActionState: negative action counter detected");
        }
      }
    }
  }

  public void setButtonMapping(String button, String action) {
    Nullable.getOrThrow(button, "IllegalButtonKey");
    Nullable.getOrThrow(action, "IllegalActionKey");

    boolean pressed = Nullable.getOrElse(buttonState.$get(button), false);

    /*
     * deactivate the button here to decrease the action counter of the previous
     * mapped action
     */
    if (pressed) {
      changeStatus(button, false);
    }

    buttonMapping.$put(button, action);

    if (pressed) {
      changeStatus(button, true);
    }
  }

  public void forEachButtonMapping(Callback2<String, String> itCb) {
    JsUtil.forEachMapValue(buttonMapping, itCb);
  }

  public void releaseButtonMapping(String button) {
    setButtonMapping(button, "NONE");
  }

}
