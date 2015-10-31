package org.wolftec.cwt.states.start;

import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.system.GameLoadingManager;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.ResourceRequestWatcher;

public class LoadingState extends AbstractState implements ResourceRequestWatcher {

  private Log log;
  private GameLoadingManager loading;
  private boolean done;

  @Override
  public void onEnter(StateFlowData flowData) {
    done = false;
    loading.loadData(() -> {
      log.info("done");
      done = true;
    });
  }

  @Override
  public void update(StateFlowData flowData, int delta, InputProvider input) {
    if (done) {
      flowData.setTransitionTo("StartScreenState");
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
