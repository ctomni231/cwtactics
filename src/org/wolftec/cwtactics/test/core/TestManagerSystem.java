package org.wolftec.cwtactics.test.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.CESManager;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

public class TestManagerSystem implements System, SystemStartEvent {

  private static final String TEST_METHOD_START_IDENTIFIER = "test";

  private static final String DISABLE_TESTS_PARAMETER = "noTestExecution";

  private static final String BEFORETEST_METHOD_NAME = "beforeTest";
  private static final String AFTERTEST_METHOD_NAME = "afterTest";

  private Log log;

  private int passed;
  private int failed;

  @Override
  public void onSystemInitialized() {
    if (isTestExecutionEnabled()) {
      callAllTests();
    }
  }

  private void callAllTests() {
    log.info("start tests");

    JsUtil.forEachArrayValue(CESManager.getObjects(ITest.class), (index, test) -> {
      callTestMethods(test);
    });

    log.info("completed tests");
  }

  private void callTestMethods(ITest test) {
    log.info("running " + ClassUtil.getClassName(test) + " test");

    resetStatistics();

    Object testProto = JSObjectAdapter.$prototype(JSObjectAdapter.$constructor(test));
    Array<String> properties = JsUtil.objectKeys(testProto);
    JsUtil.forEachArrayValue(properties, (index, property) -> {
      if (isTestCaseProperty(test, property)) {
        callTestMethod(test, property);
      }
    });

    printStatistics();

    log.info("completed " + ClassUtil.getClassName(test) + " test");
  }

  private void callTestMethod(ITest test, String methodName) {
    log.info("test case " + methodName);
    try {
      invokeMethod(test, BEFORETEST_METHOD_NAME);
      invokeMethod(test, methodName);
      invokeMethod(test, AFTERTEST_METHOD_NAME);
      log.info(".. has PASSED");
      passed++;

    } catch (Error e) {
      log.error(".. has FAILED");
      failed++;
    }
  }

  private void invokeMethod(ITest test, String methodName) {
    Object method = JSObjectAdapter.$get(test, methodName);
    if (JSGlobal.typeof(method) == "function") {
      JSFunctionAdapter.apply(method, test, JSCollections.$array());
    }
  }

  private boolean isTestCaseProperty(ITest test, String property) {
    return JSGlobal.typeof(JSObjectAdapter.$get(test, property)) == "function" && property.startsWith(TEST_METHOD_START_IDENTIFIER);
  }

  private boolean isTestExecutionEnabled() {
    String blockTests = BrowserUtil.getUrlParameterMap().$get(DISABLE_TESTS_PARAMETER);
    return blockTests != "true";
  }

  private void resetStatistics() {
    passed = 0;
    failed = 0;
  }

  private void printStatistics() {
    log.info("results: TEST-CASES:" + (passed + failed) + ", PASSED:" + passed + ", FAILED:" + failed);
  }
}
