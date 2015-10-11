package org.wolftec.cwt;

import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.states.misc.ErrorState;
import org.wolftec.cwt.system.Log;

public class ErrorManager implements Injectable {

  private Log          log;
  private StateManager stateMachine;
  private ErrorState   errorState;

  /**
   *
   * @param message
   * @param where
   */
  public void raiseError(String message, String where) {
    log.error("got error from game engine [" + message + ", " + where + "] ");

    errorState.message = message;
    errorState.where = where;

    stateMachine.changeState(ClassUtil.getClassName(errorState));
  }

  public void raiseWarning(String message, String where) {
    // @TODO
  }
}
