package org.wolftec.cwt.controller.states.base;

import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.OptionalReturn;

/**
 * 
 */
public class StateFlowData {

  private String previousState;
  private String nextState;
  private int blockInputRequest;

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
    nextState = NullUtil.getOrThrow(state);
  }

  /**
   * 
   */
  public void flushTransitionTo() {
    previousState = NullUtil.getOrThrow(nextState);
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
