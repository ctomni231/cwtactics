package org.wolftec.wPlay.state;

import org.stjs.javascript.Date;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.core.PerformanceUtil;
import org.wolftec.wCore.log.Logger;

/**
 * The state machine is the central controller of the WolfTec engine.
 */
@ManagedComponent
public class StateManager implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  @Injected
  private GameloopHandlerBak loop;

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

      loop.update(this, delta);

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
}
