package org.wolftec.cwt.states;

import org.stjs.javascript.Map;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Log;

public class StateManager implements Injectable {

  private Log log;

  private StateFlowData transition;

  /**
   * Holds all registered game states.
   */
  private Map<String, AbstractState> states;

  /**
   * The id of the active game state.
   */
  private String activeStateId;

  @Override
  public void onConstruction() {
    transition = new StateFlowData();
  }

  public String getActiveStateId() {
    return activeStateId;
  }

  public AbstractState getActiveState() {
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
      getActiveState().onExit(transition);
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
      getActiveState().onEnter(transition);
    }
  }
}
