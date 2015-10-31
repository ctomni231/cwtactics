package org.wolftec.cwt.system;

import org.stjs.javascript.functions.Callback2;

public class NullInputManager implements ManagedClass, InputProvider {

  @Override
  public boolean isActionPressed(String action) {
    return false;
  }

  @Override
  public boolean isButtonPressed(String button) {
    return false;
  }

  @Override
  public void forEachButtonMapping(Callback2<String, String> itCb) {

  }

}
