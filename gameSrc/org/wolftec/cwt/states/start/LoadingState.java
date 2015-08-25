package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.GameLoadingManager;
import org.wolftec.cwt.core.LoadingWatcher;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Option;

public class LoadingState extends AbstractState implements LoadingWatcher {

  private Log                                    log;
  private GameLoadingManager                     loading;

  private Option<Class<? extends AbstractState>> next;

  @Override
  public void onEnter(Option<Class<? extends AbstractState>> previous) {
    loading.loadData(() -> {
      log.info("done");
      next = Option.of(StartScreenState.class);
    });
    next = NO_TRANSITION;
  }

  @Override
  public Option<Class<? extends AbstractState>> update(int delta) {
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
