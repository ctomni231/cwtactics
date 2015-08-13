package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.GameLoadingManager;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Maybe;

public class LoadingState implements State {

  private Log                           log;
  private GameLoadingManager                loading;

  private Maybe<Class<? extends State>> next;

  @Override
  public void enter() {
    loading.loadData(() -> {
      log.info("done");
      next = Maybe.of(StartScreenState.class);
    });
    next = NO_TRANSITION;
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    return next;
  }

  @Override
  public void render(int delta, GraphicManager graphic) {
  }
}
