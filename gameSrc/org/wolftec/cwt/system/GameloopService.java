package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

public class GameloopService implements ManagedClass {

  // --------------- RequestAnimationFrame API ---------------

  @GlobalScope
  @STJSBridge
  static class RequestAnimationFrameGlobal {
    native static void requestAnimationFrame(Callback0 handler);
  }

  // --------------- RequestAnimationFrame API ---------------

  private StateManager sm;
  private InputManager inputMgr;
  private NullInputManager nullInputMgr;
  private GraphicManager gfx;

  private Array<GameloopWatcher> frameWatchers;

  private Log log;

  private StateFlowData transitionData;
  private boolean active;
  private int blockInputTime;
  private long oldTime;
  private Callback0 loopFunction;

  @Override
  public void onConstruction() {

    /*
     * accessing the object with that is faster because loopFunction has not to
     * be bind against the loop object
     */
    final GameloopService that = this;

    that.active = false;
    that.transitionData = new StateFlowData();
    that.oldTime = JsUtil.getTimestamp();
    that.loopFunction = () -> {

      long now = JsUtil.getTimestamp();
      int delta = (int) (now - that.oldTime);
      that.oldTime = now;

      that.update(delta);

      if (that.active) {
        RequestAnimationFrameGlobal.requestAnimationFrame(that.loopFunction);
      }
    };
  }

  private void update(int delta) {
    for (int i = 0; i < frameWatchers.$length(); i++) {
      frameWatchers.$get(i).onFrameTick(delta);
    }

    AbstractState activeState = sm.getActiveState();

    if (blockInputTime > 0) {
      blockInputTime -= delta;
    }

    activeState.update(transitionData, delta, blockInputTime <= 0 ? inputMgr : nullInputMgr);
    activeState.render(delta, gfx);

    if (transitionData.hasInputBlockRequest()) {
      blockInputTime = transitionData.getInputBlockRequest();
      transitionData.flushInputBlockRequest();
    }

    String nextState = transitionData.getNextState();
    if (NullUtil.isPresent(nextState)) {
      sm.changeState(nextState);
      transitionData.flushTransitionTo();
      blockInputTime = Constants.BLOCK_INPUT_TIME;
    }
  }

  /**
   * Starts the central application loop which starts the game flow. The
   * environment will try to invoke the loop every 16ms. In this invocation the
   * active state will be updated and all {@link GameloopWatcher} objects will
   * be triggered.
   */
  public void start() {
    AssertUtil.assertThat(!active);

    active = true;
    log.info("starting game loop");

    RequestAnimationFrameGlobal.requestAnimationFrame(loopFunction);
  }

  /**
   * Stops the game loop.
   */
  public void stop() {
    AssertUtil.assertThat(active);

    active = false;
    log.info("stopping game loop");
  }
}
