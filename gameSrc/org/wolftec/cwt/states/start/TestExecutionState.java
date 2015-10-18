package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.test.TestManager;
import org.wolftec.cwt.core.test.TestManager.TestExecutionResults;

public class TestExecutionState extends AbstractState {

  private Log         log;
  private TestManager manager;

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    TestExecutionResults results = manager.callAllTests();

    log.info("");
    log.info("Test results (summary)");
    log.info("======================");
    log.info("");
    log.info("RUNS   : " + results.runs);
    log.info("PASSED : " + results.passed);
    log.info("FAILED : " + results.failed);
    log.info("");

    log.info("Test results (details)");
    log.info("======================");
    log.info("");
    ListUtil.forEachArrayValue(results.tests, (testI, testData) -> {
      ListUtil.forEachArrayValue(testData.methods, (testMethodI, testMethodData) -> {
        if (testMethodData.succeeded) {
          log.info("[PASSED] " + testData.name + "." + testMethodData.name);
        } else {
          log.error("[FAILED] " + testData.name + "." + testMethodData.name, testMethodData.error);
        }
      });
    });
    log.info("");

    transition.setTransitionTo(results.failed == 0 ? "TestSucceededState" : "TestFailedState");
  }
}
