package org.wolfTec.wolfTecEngine.statemachine;

import org.stjs.javascript.Array;
import org.stjs.javascript.Date;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.wolfTecEngine.input.InputManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.network.NetworkBackend;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.core.PerformanceUtil;

/**
 * The state machine is the central controller of the WolfTec engine.
 */
@ManagedComponent
public class StateManager implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  @Injected
  private InputManager input;

  @Injected
  private NetworkBackend network;

  @Injected
  private ActionQueueHandler<?> action;

  @Injected
  private Array<GameloopHandler> loopHandlers;

  @Injected
  private Map<String, State> states;

  /**
   * The current active game state
   */
  public State activeState;

  private boolean started;

  private int timestamp;

  private boolean stopLoop;

  /**
   * The central game loop which calls the update function every frame of a 60
   * frames per second loop.
   */
  private Callback0 gameloop;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    gameloop = () -> {

      // update timer
      int newTimestamp = (int) (new Date()).getTime();
      int delta = newTimestamp - timestamp;
      timestamp = newTimestamp;

      update(delta);

      // acquire next frame
      if (stopLoop) {
        stopLoop = false;
      } else {
        BrowserUtil.requestAnimationFrame(this.gameloop);
        // JsExec.injectJS("requestAnimationFrame(this.gameLoop)");
      }
    };
  }

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   *
   * @param stateId
   */
  public void changeState(String stateId) {
    if (activeState != null) {
      log.info("leaving step " + stateId);

      activeState.exit(this);
    }
    setState(stateId, true);
  }

  /**
   *
   * @param stateId
   */
  public void changeToStateClass(Class<? extends State> stateId) {
    changeState(JsUtil.getBeanName(activeState));
  }

  public void setState(String stateId, boolean fireEvent) {
    activeState = states.$get(stateId);
    log.info("enter step " + stateId);

    if (fireEvent) {
      activeState.enter(this);
    }
  }

  /**
   * Starts the loop of the state machine and calls the gameLoop function in
   * every frame.
   */
  public void startGameloop() {
    if (started) {
      JsUtil.raiseError("Already started");
    }

    started = true;

    log.info("Starting state machine");

    // prepare and invoke game loop
    timestamp = PerformanceUtil.getCurrentTime();
    gameloop.$invoke();
  }

  /**
   * Stops the game loop of the state machine.
   */
  public void stopGameloop() {
    stopLoop = true;
  }

  /**
   * Central update method that invokes the active state and calls the action
   * invoker to evaluate buffered commands. Furthermore it grabs the user input
   * from the input system to forward them to the update method of the active
   * state.
   *
   * @param delta
   */
  private void update(int delta) {
    if (!activeState.isAnimationState()) {
      if (action.hasQueuedActions()) {
        action.invokeNextAction();
        return;
      }

      for (int i = 0; i < loopHandlers.$length(); i++) {
        loopHandlers.$get(delta);
      }
    }

    activeState.update(this, input, delta);
    activeState.render(delta);
  }
}
