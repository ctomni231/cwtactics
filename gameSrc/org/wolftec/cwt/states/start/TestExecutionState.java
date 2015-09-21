package org.wolftec.cwt.states.start;

import org.wolftec.cwt.core.test.TestManager;
import org.wolftec.cwt.core.test.TestManager.TestResults;
import org.wolftec.cwt.input.InputProvider;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.StateTransition;
import org.wolftec.cwt.system.Log;

public class TestExecutionState extends AbstractState {

  private Log         log;
  private TestManager manager;

  @Override
  public void update(StateTransition transition, int delta, InputProvider input) {
    TestResults results = manager.callAllTests();
    log.info("test results [RUNS: " + results.tests + " PASSED: " + results.passed + " FAILS: " + results.failed + "]");
    transition.setTransitionTo(results.failed == 0 ? "TestSucceededState" : "TestFailedState");
  }
}
