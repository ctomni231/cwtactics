package org.wolftec.cwt;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.states.StateManager;

public class ErrorManager implements Injectable {

  private StateManager state;
  public Object        errorState;

  /**
   *
   * @param message
   * @param where
   */
  public void raiseError(String message, String where) {
    state.changeState("ERROR_SCREEN");

    // set meta data
    // errorState.setErrorData(message, where)
  }
}
