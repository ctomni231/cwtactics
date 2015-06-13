package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.ITest;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.ConstructedFactory;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

public class TestManagerSystem implements ConstructedClass, SystemStartEvent {

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

    JsUtil.forEachArrayValue(ConstructedFactory.getObjects(ITest.class), (index, test) -> {
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

    log.info("completed " + ClassUtil.getClassName(test) + " test [TEST-CASES:" + (passed + failed) + " - PASSED:" + passed + " - FAILED:" + failed + "]");
  }

  private void callTestMethod(ITest test, String methodName) {
    log.info("test case " + methodName);
    try {
      JSFunctionAdapter.apply(JSObjectAdapter.$get(test, methodName), test, JSCollections.$array());
      log.info(".. has PASSED");
      passed++;

    } catch (Error e) {
      log.error(".. has FAILED");
      failed++;
    }
  }

  private boolean isTestCaseProperty(ITest test, String property) {
    return JSGlobal.typeof(JSObjectAdapter.$get(test, property)) == "function" && property.startsWith("test");
  }

  private boolean isTestExecutionEnabled() {
    String runTests = BrowserUtil.getUrlParameterMap().$get("runTests");
    return runTests == "true";
  }

  private void resetStatistics() {
    passed = 0;
    failed = 0;
  }
}
