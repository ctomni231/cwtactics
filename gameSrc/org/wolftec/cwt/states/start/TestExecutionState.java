package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.input.InputProvider;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.state.AbstractState;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.test.TestExecutionResults;
import org.wolftec.cwt.core.test.TestManager;

public class TestExecutionState extends AbstractState {

  private Log         log;
  private TestManager manager;

  @Override
  public void update(StateFlowData transition, int delta, InputProvider input) {
    TestExecutionResults results = manager.callAllTests();

    log.info("Test results, " + results.passed + " has passed and " + results.failed + " has failed");
    ListUtil.forEachArrayValue(results.tests, (testI, testData) -> {
      ListUtil.forEachArrayValue(testData.methods, (testMethodI, testMethodData) -> {
        if (testMethodData.succeeded) {
          log.info("[PASSED] " + testData.name + "." + testMethodData.name);
        } else {
          log.error("[FAILED] " + testData.name + "." + testMethodData.name, testMethodData.error);
        }
      });
    });

    transition.setTransitionTo(results.failed == 0 ? "TestSucceededState" : "TestFailedState");
  }
}
