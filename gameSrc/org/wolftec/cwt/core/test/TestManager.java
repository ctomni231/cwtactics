package org.wolftec.cwt.core.test;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.SyntheticType;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.NumberUtil;
import org.wolftec.cwt.system.VersionUtil;

public class TestManager implements Injectable {

  private static final String TEST_METHOD_START_IDENTIFIER = "test";
  private static final String BEFORETEST_METHOD_NAME       = "beforeTest";
  private static final String AFTERTEST_METHOD_NAME        = "afterTest";

  @SyntheticType
  public static class TestResults {
    public int passed;
    public int failed;
    public int tests;
  }

  private Log log;

  private Array<Test> tests;

  @Override
  public void onConstruction() {
    tests.sort((a, b) -> {
      int indexA = VersionUtil.convertVersionToNumber(a.getIndex());
      int indexB = VersionUtil.convertVersionToNumber(b.getIndex());
      return NumberUtil.compareInt(indexA, indexB);
    });
  }

  public boolean hasTests() {
    return tests.$length() > 0;
  }

  public TestResults callAllTests() {
    log.info("start tests");

    TestResults results = new TestResults();
    results.failed = 0;
    results.passed = 0;
    results.tests = 0;

    ListUtil.forEachArrayValue(tests, (index, test) -> callTestMethods(test, results));

    log.info("completed tests");
    return results;
  }

  private TestResults callTestMethods(Test test, TestResults results) {
    log.info("running " + ClassUtil.getClassName(test) + " test");

    Object testProto = JSObjectAdapter.$prototype(JSObjectAdapter.$constructor(test));
    Array<String> properties = JsUtil.objectKeys(testProto);
    ListUtil.forEachArrayValue(properties, (index, property) -> {
      if (isTestCaseProperty(test, property)) {
        callTestMethod(test, property, results);
      }
    });

    log.info("completed " + ClassUtil.getClassName(test) + " test");

    return results;
  }

  private void callTestMethod(Test test, String methodName, TestResults results) {
    log.info("test case " + methodName);

    results.tests++;
    try {
      invokeMethod(test, BEFORETEST_METHOD_NAME);
      invokeMethod(test, methodName);
      invokeMethod(test, AFTERTEST_METHOD_NAME);
      log.info(".. has PASSED");
      results.passed++;

    } catch (Exception e) {
      log.error(".. has FAILED", e);
      results.failed++;
    }
  }

  private void invokeMethod(Test test, String methodName) {
    Object method = JSObjectAdapter.$get(test, methodName);
    if (JSGlobal.typeof(method) == "function") {
      JSFunctionAdapter.apply(method, test, JSCollections.$array());
    }
  }

  private boolean isTestCaseProperty(Test test, String property) {
    return JSGlobal.typeof(JSObjectAdapter.$get(test, property)) == "function" && property.startsWith(TEST_METHOD_START_IDENTIFIER);
  }
}
