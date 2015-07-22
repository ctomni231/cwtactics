package org.wolftec.cwt.states;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.core.Injectable;

public class StateManager implements Injectable {

  /**
   * Holds all registered game states.
   */
  private Map<String, State> states;

  /**
   * The id of the active game state.
   */
  public String              activeStateId;

  /**
   * The active game state.
   */
  public State               activeState;

  @Override
  public void onConstruction() {
    states = JSCollections.$map();
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param stateId
   */
  public void changeState(String stateId) {
    if (exports.activeState) {
      if (exports.activeState.exit) {
        exports.activeState.exit();
      }
    }

    // enter new state
    this.setState(stateId, true);
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   * 
   * @param stateId
   * @param fireEvent
   */
  public void setState(String stateId, boolean fireEvent) {
    if (constants.DEBUG) {
      console.log("set active state to " + stateId + ((fireEvent) ? " with firing enter event" : ""));
    }

    exports.activeState = states[stateId];
    exports.activeStateId = stateId;

    if (fireEvent != false) {
      exports.activeState.enter();
    }
  }
}
