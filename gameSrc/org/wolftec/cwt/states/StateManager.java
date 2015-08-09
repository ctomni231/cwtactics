package org.wolftec.cwt.states;

import org.stjs.javascript.Map;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;

public class StateManager implements Injectable {

  private Log                log;

  /**
   * Holds all registered game states.
   */
  private Map<String, State> states;

  /**
   * The id of the active game state.
   */
  private String             activeStateId;

  /**
   * The active game state.
   */
  private State              activeState;

  public String getActiveStateId() {
    return activeStateId;
  }

  public State getActiveState() {
    return activeState;
  }

  @Override
  public void onConstruction() {
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param stateId
   */
  public void changeState(String stateId) {
    if (activeState != null) {
      activeState.exit();
    }

    // enter new state
    setState(stateId, true);
  }

  public void setStateByType(Class<?> stateClass, boolean fireEvent) {
    setState(ClassUtil.getClassName(stateClass), fireEvent);
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param stateId
   * @param fireEvent
   */
  public void setState(String stateId, boolean fireEvent) {
    log.info("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));

    activeState = states.$get(stateId);
    activeStateId = stateId;

    // TODO prevent that ?
    if (fireEvent != false) {
      activeState.enter();
    }
  }
}
