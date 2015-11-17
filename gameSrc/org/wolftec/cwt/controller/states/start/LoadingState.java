package org.wolftec.cwt.controller.states.start;

import org.wolftec.cwt.controller.states.base.State;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.loading.GameLoadingManager;
import org.wolftec.cwt.loading.ResourceRequestWatcher;
import org.wolftec.cwt.view.GraphicManager;
import org.wolftec.cwt.view.input.InputService;

public class LoadingState extends State implements ResourceRequestWatcher {

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
  public void update(StateFlowData flowData, int delta, InputService input) {
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
