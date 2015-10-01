package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.GameLoadingManager;
import org.wolftec.cwt.core.LoadingWatcher;
import org.wolftec.cwt.core.test.TestManager;
import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.UrlParameterUtil;

public class LoadingState extends AbstractState implements LoadingWatcher {

  private Log                log;
  private GameLoadingManager loading;
  private TestManager        tests;

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {
    if (!loading.isStarted()) {
      loading.loadData(() -> {
        log.info("done");

        if (UrlParameterUtil.getUrlParameter("noTests") != "1" && tests.hasTests()) {
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
