package org.wolftec.cwt.states;

import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.system.Option;

/**
 * 
 */
public class StateTransition {

  private Option<String> previousState;
  private Option<String> nextState;

  /**
   * 
   * @param nullableState
   */
  public void setTransitionTo(String state) {
    nextState = Option.of(state);
  }

  /**
   * 
   */
  public void flushTransitionTo() {
    if (!nextState.isPresent()) {
      JsUtil.throwError("NoSuchStateException: cannot flush target value null");
    }
    previousState = nextState;
    nextState = Option.empty();
  }

  /**
   * 
   * @return
   */
  public Option<String> getNextState() {
    return nextState;
  }

  /**
   * 
   * @return
   */
  public Option<String> getPreviousState() {
    return previousState;
  }

}
