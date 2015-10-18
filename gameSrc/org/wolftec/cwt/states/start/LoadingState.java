package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.loading.GameLoadingManager;
import org.wolftec.cwt.core.loading.LoadingWatcher;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.test.TestManager;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.UrlParameterUtil;
import org.wolftec.cwt.renderer.GraphicManager;

public class LoadingState extends AbstractState implements LoadingWatcher {

  private Log                log;
  private GameLoadingManager loading;
  private TestManager        tests;

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    if (!loading.isStarted()) {
      loading.loadData(() -> {
        log.info("done");

        if (NullUtil.getOrElse(UrlParameterUtil.getParameter("noTests"), "") != "1" && tests.hasTests()) {
          transition.setTransitionTo("TestExecutionState");
        } else {
          transition.setTransitionTo("StartScreenState");
        }
      });
    }
  }

  @Override
  public void render(int delta, GraphicManager gfx) {
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
