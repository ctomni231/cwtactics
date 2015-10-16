package org.wolftec.cwt.states;

import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.core.util.JsUtil;

/**
 * 
 */
public class StateFlowData {

  private Option<String>  previousState;
  private Option<String>  nextState;
  private Option<Integer> blockInputRequest;

  public StateFlowData() {
    previousState = Option.empty();
    nextState = Option.empty();
    blockInputRequest = Option.empty();
  }

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

  public void flushInputBlockRequest() {
    blockInputRequest = Option.empty();
  }

  public void requestInputBlock(int time) {
    if (time <= 0) {
      JsUtil.throwError("IllegalArgument: negative time");
    }
    blockInputRequest = Option.of(time);
  }

  public Option<Integer> getInputBlockRequest() {
    return blockInputRequest;
  }

}
