package org.wolftec.cwt;

import org.wolftec.cwt.core.Injectable;

public class ErrorManager implements Injectable {

  public Object stateMachine;
  public Object errorState;

  /**
   *
   * @param message
   * @param where
   */
  public void raiseError(String message, String where) {
    // TODO
    // set state
    // stateMachine.changeState("ERROR_SCREEN");

    // set meta data
    // errorState.setErrorData(message, where)
  }
}
