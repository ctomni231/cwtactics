package org.wolftec.cwt.states.start;

import org.stjs.javascript.Global;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.system.Features;
import org.wolftec.cwt.system.InputProvider;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.test.TestManager;
import org.wolftec.cwt.util.UrlParameterUtil;

public class CheckSystemState extends AbstractState {

  private Log log;
  private TestManager tests;
  private Features features;

  @Override
  public void onEnter(StateFlowData transition) {
  }

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    log.info("checking abilities of the active environment");

    boolean skipCheck = UrlParameterUtil.getParameter("skipEnvCheck") == "true";
    if (skipCheck || !features.supported) {

      log.warn("system is not supported");

      if (Global.confirm("Go on ?")) {
        // HINT may show a styled dialog here
        log.warn("starting cwtactics in an unsupported environment");
      }

    } else {
      log.info("starting cwtactics in an supported environment");
    }

    tests.executeTests();

    transition.setTransitionTo("LoadingState");
  }
}
