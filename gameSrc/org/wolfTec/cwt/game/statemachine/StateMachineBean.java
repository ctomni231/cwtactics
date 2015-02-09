package org.wolfTec.cwt.game.statemachine;

import org.stjs.javascript.Date;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.input.InputBean;
import org.wolfTec.cwt.game.input.InputData;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;

@Bean public class StateMachineBean {

  @InjectedByFactory private Logger log;
  @Injected private InputBean input;
  @Injected private ActionInvokerBean action;

  /**
   * Holds all registered game states.
   */
  private Map<String, State> states;

  /**
   * The active game state.
   */
  private State activeState;

  /**
   * The id of the active game state.
   */
  private String activeStateId;

  public State activeState() {
    return null;
  }

  private boolean started;

  public StateMachineBean() {
    states = JSCollections.$map();
  }

  public void addState(String id, State state) {
    if (JSObjectAdapter.hasOwnProperty(states, id)) {
      log.error("StateAlreadyRegistered");
    }

    states.$put(id, state);
  }

  private int timestamp;

  /**
   * The central game loop which calls the update function every frame of a 60
   * fps loop.
   */
  private final Callback0 gameLoop = new Callback0() {
    @Override public void $invoke() {

      // update timer
      int newTimestamp = (int) (new Date()).getTime();
      int delta = newTimestamp - timestamp;
      timestamp = newTimestamp;

      update(delta);

      // acquire next frame
      JSObjectAdapter.$js("requestAnimationFrame(gameLoop)");
    }
  };

  /**
   * Central update method that invokes the active state and calls the action
   * invoker to evaluate buffered commands. Furthermore it grabs the user input
   * from the input system to forward them to the update method of the active
   * state.
   *
   * @param delta
   */
  public void update(int delta) {

    if (activeState.isAnimationState()) {
      activeState.update(delta, null);
      activeState.render(delta);
    }

    // try to evaluate commands asap
    if (action.hasActions()) {
      action.invokeNext();
      return;
    }

    // update game-pad controls
    // if (features.gamePad && gamePad.update) {
    // gamePad.update();
    // }

    // state update
    InputData inp = input.grabCommand();
    activeState.update(delta, inp);
    activeState.render(delta);

    // release input data object
    if (inp != null) {
      input.releaseAction(inp);
    }
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
    setState(stateId, true);
  }

  public void setState(String stateId, boolean fireEvent) {
    activeState = states.$get(stateId);
    activeStateId = stateId;

    if (fireEvent) {
      activeState.enter();
    }
  }

  /**
   * Starts the loop of the state machine and calls the gameLoop function in
   * every frame.
   */
  public void startGameloop() {
    if (started) throw new IllegalStateException("Already started");
    started = true;

    log.info("Starting CW:T state machine");

    // prepare and invoke game loop
    timestamp = (int) (new Date()).getTime(); // TODO
    JSObjectAdapter.$js("requestAnimationFrame(gameLoop)");
  }

  public void stopGameloop() {

  }
}
