package org.wolftec.cwt;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.FrameTickListener;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Option;

public class GameLoopManager implements Injectable {

  @GlobalScope
  @STJSBridge
  static class RequestAnimationFrameGlobal {
    native static void requestAnimationFrame(Callback0 handler);
  }

  private StateManager             sm;
  private Log                      log;

  private Array<FrameTickListener> frameWatchers;

  private boolean                  active;

  private long                     oldTime;
  private Callback0                loopFunction;

  @Override
  public void onConstruction() {
    active = false;

    /*
     * accessing the object with that is faster because loopFunction has not to
     * be bind against the loop object
     */
    final GameLoopManager that = this;

    oldTime = BrowserUtil.getTimestamp();
    loopFunction = () -> {

      long now = BrowserUtil.getTimestamp();
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
    Option<Class<? extends AbstractState>> nexState = activeState.update(delta);
    activeState.render(delta);

    if (nexState.isPresent()) {
      sm.changeState(nexState.get());
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
