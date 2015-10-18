package org.wolftec.cwt;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.gameloop.FrameTickListener;
import org.wolftec.cwt.core.input.BlockedInputManager;
import org.wolftec.cwt.core.input.InputManager;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.state.StateManager;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.renderer.GraphicManager;

public class GameLoopManager implements Injectable {

  private static final int BLOCK_INPUT_TIME = 250;

  @GlobalScope
  @STJSBridge
  static class RequestAnimationFrameGlobal {
    native static void requestAnimationFrame(Callback0 handler);
  }

  private StateManager             sm;
  private InputManager             inputMgr;
  private BlockedInputManager      nullInputMgr;
  protected GraphicManager         gfx;
  private Array<FrameTickListener> frameWatchers;

  private Log log;

  private StateFlowData transitionData;
  private boolean       active;
  private int           blockInputTime;
  private long          oldTime;
  private Callback0     loopFunction;

  @Override
  public void onConstruction() {
    active = false;

    transitionData = new StateFlowData();

    /*
     * accessing the object with that is faster because loopFunction has not to
     * be bind against the loop object
     */
    final GameLoopManager that = this;

    oldTime = JsUtil.getTimestamp();
    loopFunction = () -> {

      long now = JsUtil.getTimestamp();
      int delta = (int) (now - that.oldTime);
      that.oldTime = now;

      that.update(delta);

      if (that.active) {
        RequestAnimationFrameGlobal.requestAnimationFrame(that.loopFunction);
      }
    };
  }

  /**
   * 
   * @param delta
   */
  public void update(int delta) {
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
      blockInputTime = BLOCK_INPUT_TIME;
    }
  }

  /**
   * Starts the game state machine.
   */
  public void start() {
    if (active) {
      JsUtil.throwError("IllegalState");
      // TODO
    }

    active = true;
    log.info("starting game loop");

    RequestAnimationFrameGlobal.requestAnimationFrame(loopFunction);
  }

  public void stop() {
    active = false;
    log.info("stopping game loop");
  }
}
