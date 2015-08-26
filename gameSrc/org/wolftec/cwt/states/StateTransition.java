package org.wolftec.cwt.states;

import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.Option;

/**
 * 
 */
public class StateTransition {

  private Class<? extends AbstractState> previousState;
  private Class<? extends AbstractState> nextState;

  /**
   * 
   * @param nullableState
   */
  public void setTransitionTo(Class<? extends AbstractState> nullableState) {
    nextState = nullableState;
  }

  /**
   * 
   */
  public void flushTransitionTo() {
    if (nextState == null) {
      JsUtil.throwError("NoSuchStateException: cannot flush target value null");
    }
    previousState = nextState;
    nextState = null;
  }

  /**
   * 
   * @return
   */
  public Option<Class<? extends AbstractState>> getNextState() {
    return Option.ofNullable(nextState);
  }

  /**
   * 
   * @return
   */
  public Option<Class<? extends AbstractState>> getPreviousState() {
    return Option.ofNullable(previousState);
  }

}
