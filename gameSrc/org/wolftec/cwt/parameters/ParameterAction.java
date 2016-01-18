package org.wolftec.cwt.parameters;

import org.stjs.javascript.functions.Callback0;

public interface ParameterAction
{
  String watchesOnParameterKey();

  boolean isValid(String parameterValue);

  void handle(String parameterValue, Callback0 whenDone);
}
