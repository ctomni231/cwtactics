package org.wolftec.cwt.core.state;

import org.wolftec.cwt.core.annotations.OptionalReturn;
import org.wolftec.cwt.core.util.AssertUtil;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;

/**
 * 
 */
public class StateFlowData {

  private String previousState;
  private String nextState;
  private int    blockInputRequest;

  public StateFlowData() {
    previousState = null;
    nextState = null;
    blockInputRequest = 0;
  }

  /**
   * 
   * @param nullableState
   */
  public void setTransitionTo(String state) {
    NullUtil.mustBePresent(state, "next state is undefined");
    nextState = state;
  }

  /**
   * 
   */
  public void flushTransitionTo() {
    if (!NullUtil.isPresent(nextState)) {
      JsUtil.throwError("NoSuchStateException: cannot flush target value null");
    }
    previousState = nextState;
    nextState = null;
  }

  /**
   * 
   * @return
   */
  @OptionalReturn
  public String getNextState() {
    return nextState;
  }

  /**
   * 
   * @return
   */
  @OptionalReturn
  public String getPreviousState() {
    return previousState;
  }

  public void flushInputBlockRequest() {
    blockInputRequest = 0;
  }

  public boolean hasInputBlockRequest() {
    return blockInputRequest > 0;
  }

  public void requestInputBlock(int time) {
    AssertUtil.assertThatNot(time <= 0, "negative time");
    blockInputRequest = time;
  }

  public int getInputBlockRequest() {
    AssertUtil.assertThat(blockInputRequest > 0, "no requested block");
    return blockInputRequest;
  }

}
