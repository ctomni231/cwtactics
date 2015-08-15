package org.wolftec.cwt;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.system.Log;

public class ErrorManager implements Injectable {

  private Log          log;
  private StateManager state;

  /**
   *
   * @param message
   * @param where
   */
  public void raiseError(String message, String where) {
    log.error("got error from game engine [" + message + ", " + where + "] ");

    // state.changeState("ERROR_SCREEN");

    // set meta data
    // errorState.setErrorData(message, where)
  }
}
