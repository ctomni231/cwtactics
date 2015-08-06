package org.wolftec.cwt;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.input.InputData;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.ActionManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.system.Features;
import org.wolftec.cwt.system.Log;

public class GameLoopManager implements Injectable {

  @GlobalScope
  @STJSBridge
  static class Raf {
    native static void requestAnimationFrame(Callback0 handler);
  }

  private static final String NOW_AS_MILLIES = "new Date().getTime()";

  private StateManager        sm;
  private InputManager        input;
  private Log                 log;
  private Features            features;
  private ActionManager       actions;

  private boolean             active;

  @Override
  public void onConstruction() {
    active = false;
  }

  /**
   * 
   * @param delta
   */
  public void update(int delta) {
    State activeState = sm.getActiveState();

    InputData inp = input.popAction();

    if (activeState.animation) {
      activeState.update(delta, inp);
      activeState.render(delta);
      return;
    }

    // try to evaluate commands first
    if (actions.hasData()) {
      actions.invokeNext();
      return;
    }

    // update game-pad controls
    if (features.gamePad && gamePad.update) {
      gamePad.update();
    }

    // state update
    activeState.update(delta, inp);
    activeState.render(delta);

    // release input data object
    if (inp != null) {
      input.releaseAction(inp);
    }
  }

  // Starts the game state machine.
  //
  public void start() {
    if (active) {
      JsUtil.throwError("IllegalState");
      // TODO
    }

    active = true;
    log.info("starting game state machine");

    // faster because no bind necessary in the game loop
    GameLoopManager thisAccess = this;

    int oldTime = JSObjectAdapter.$js(NOW_AS_MILLIES);

    Callback0 gameLoop = () -> {

      int now = JSObjectAdapter.$js(NOW_AS_MILLIES);
      int delta = now - oldTime;
      oldTime = now;

      thisAccess.update(delta);

      if (!active) {
        Raf.requestAnimationFrame(gameLoop);
      }
    };

    // set start state
    sm.setState("NONE", false);

    // enter the loop
    Raf.requestAnimationFrame(gameLoop);
  }

  public void stop() {
    active = false;
  }
}
