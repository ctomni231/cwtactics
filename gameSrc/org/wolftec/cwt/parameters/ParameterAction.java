package org.wolftec.cwt.parameters;

import org.stjs.javascript.functions.Callback0;

public interface ParameterAction
{
  /**
   * 
   * @return name of the parameter that triggers the invocation of the action
   */
  String watchesOnParameterKey();

  /**
   * 
   * @param parameterValue
   * @return true when the handler can accept the parameter value, else false
   */
  boolean isValid(String parameterValue);

  /**
   * Handles the parameter by doing some actions in the game.
   * 
   * @param parameterValue
   * @param whenDone
   *          to be called when the handler has done all of it's tasks
   */
  void handle(String parameterValue, Callback0 whenDone);
}
