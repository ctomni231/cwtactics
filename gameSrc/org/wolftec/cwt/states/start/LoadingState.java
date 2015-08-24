package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.GameLoadingManager;
import org.wolftec.cwt.core.LoadingWatcher;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Maybe;

public class LoadingState extends AbstractState implements LoadingWatcher {

  private Log                           log;
  private GameLoadingManager            loading;

  private Maybe<Class<? extends AbstractState>> next;

  @Override
  public void onEnter(Maybe<Class<? extends AbstractState>> previous) {
    loading.loadData(() -> {
      log.info("done");
      next = Maybe.of(StartScreenState.class);
    });
    next = NO_TRANSITION;
  }

  @Override
  public Maybe<Class<? extends AbstractState>> update(int delta) {
    return next;
  }

  @Override
  public void render(int delta) {
  }

  @Override
  public void onStartLoading(String what) {
    // TODO Auto-generated method stub

  }

  @Override
  public void onFinishedLoading(String what) {
    // TODO Auto-generated method stub

  }
}
