package org.wolftec.cwt.controller.states.base;

import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.view.GraphicManager;
import org.wolftec.cwt.view.input.InputService;

public class StateManager implements ManagedClass, GameloopWatcher {

  private Log log;

  private StateFlowData flowData;
  private int blockInputTime;

  private GraphicManager gfx;
  private InputService inputMgr;

  /**
   * Holds all registered game states.
   */
  private Map<String, State> states;

  /**
   * The id of the active game state.
   */
  private String activeStateId;

  @Override
  public void onConstruction() {
    flowData = new StateFlowData();
  }

  public String getActiveStateId() {
    return activeStateId;
  }

  public State getActiveState() {
    return states.$get(activeStateId);
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param state
   */
  public void changeState(String state) {
    if (activeStateId != null) {
      getActiveState().onExit(flowData);
    }

    // enter new state
    setState(state, true);
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param stateId
   * @param fireEvent
   */
  public void setState(String state, boolean fireEvent) {
    log.info("set active state to " + state + ((fireEvent) ? " with firing enter event" : ""));
    activeStateId = state;

    // TODO prevent that ?
    if (fireEvent != false) {
      getActiveState().onEnter(flowData);
    }
  }

  @Override
  public void onFrameTick(int delta) {
    State activeState = getActiveState();

    if (blockInputTime > 0) {
      blockInputTime -= delta;
      if (blockInputTime <= 0) {
        inputMgr.unblock();
      }
    }

    activeState.update(flowData, delta, inputMgr);
    activeState.render(delta, gfx);

    if (flowData.hasInputBlockRequest()) {
      blockInputTime = flowData.getInputBlockRequest();
      inputMgr.block();
      flowData.flushInputBlockRequest();
    }

    String nextState = flowData.getNextState();
    if (NullUtil.isPresent(nextState)) {
      changeState(nextState);
      flowData.flushTransitionTo();
      blockInputTime = Constants.BLOCK_INPUT_TIME;
    }
  }
}
