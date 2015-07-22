package org.wolftec.cwt;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.system.Log;

public class GameLoopManager implements Injectable {

  private static final String NOW_AS_MILLIES = "new Date().getTime()";

  private StateManager        sm;
  private Log                 log;

  private boolean             started;

  @Override
  public void onConstruction() {
    started = false;
  }

  /**
   * 
   * @param delta
   */
  public void update(int delta) {

    if (sm.activeState.animation) {
      sm.activeState.update(delta);
      sm.activeState.render(delta);
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
    var inp = input.popAction();
    exports.activeState.update(delta, inp);
    exports.activeState.render(delta);

    // release input data object
    if (inp) {
      input.releaseAction(inp);
    }
  }

  // Starts the game state machine.
  //
  public void start() {
    if (started) throw Error("already started");
    started = true;

    log.info("starting game state machine");

    int oldTime = JSObjectAdapter.$js(NOW_AS_MILLIES);

    Callback0 gameLoop = () -> {

      // calculate delta
      int now = JSObjectAdapter.$js(NOW_AS_MILLIES);
      int delta = now - oldTime;
      oldTime = now;

      // update machine
      update(delta);

      // acquire next frame
      requestAnimationFrame(gameLoop);
    };

    // inject loading states
    addState(require("./states/start_none").state);
    addState(require("./states/start_load").state);

    // set start state
    exports.setState("NONE", false);

    // enter the loop
    requestAnimationFrame(gameLoop);
  }
}
