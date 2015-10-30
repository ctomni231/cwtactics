package org.wolftec.cwt.states.start;

import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.wTec.input.InputProvider;
import org.wolftec.wTec.loading.GameLoadingManager;
import org.wolftec.wTec.loading.LoadingWatcher;
import org.wolftec.wTec.log.Log;
import org.wolftec.wTec.state.AbstractState;
import org.wolftec.wTec.state.StateFlowData;

public class LoadingState extends AbstractState implements LoadingWatcher {

  private Log log;
  private GameLoadingManager loading;

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (!loading.isStarted()) {
      loading.loadData(() -> {
        log.info("done");
        transition.setTransitionTo("StartScreenState");
      });
    }
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
  }

  @Override
  public void onStartLoading(String what) {

  }

  @Override
  public void onFinishedLoading(String what) {

  }
}
