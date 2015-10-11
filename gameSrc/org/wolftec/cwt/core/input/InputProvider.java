package org.wolftec.cwt.core.input;

import org.stjs.javascript.functions.Callback2;

public interface InputProvider {

  /**
   * 
   * @param action
   * @return true if the given action is pressed, else false
   */
  boolean isActionPressed(String action);

  /**
   * 
   * @param button
   * @return true if the given button is pressed, else false
   */
  boolean isButtonPressed(String button);

  /**
   * 
   * @param itCb
   */
  void forEachButtonMapping(Callback2<String, String> itCb);

}