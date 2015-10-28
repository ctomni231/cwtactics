package org.wolftec.cwt.core.test;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSFunctionAdapter;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.NumberUtil;
import org.wolftec.cwt.core.util.UrlParameterUtil;
import org.wolftec.cwt.core.util.VersionUtil;

public class TestManager implements Injectable {

  private Log log;

  private static final String TEST_METHOD_START_IDENTIFIER = "test";
  private static final String BEFORETEST_METHOD_NAME = "beforeTest";
  private static final String AFTERTEST_METHOD_NAME = "afterTest";

  private Array<Test> tests;

  @Override
  public void onConstruction() {
    tests.sort((a, b) -> {
      int indexA = VersionUtil.convertVersionToNumber(a.getIndex());
      int indexB = VersionUtil.convertVersionToNumber(b.getIndex());
      int res = NumberUtil.compare(indexA, indexB);

      if (res == 0) {

        String aClassName = ClassUtil.getClassName(a);
        String bClassName = ClassUtil.getClassName(b);
        if (((boolean) JSObjectAdapter.$js("aClassName < bClassName"))) {
          return -1;
        } else {
          return +1;
        }
      }
      return res;
    });
  }

  public boolean hasTests() {
    return tests.$length() > 0;
  }

  public void executeTests() {
    TestExecutionResults results = callAllTests();

    boolean skipTests = NullUtil.getOrElse(UrlParameterUtil.getParameter("noTests"), "false").equals("true");
    if (hasTests() && !skipTests) {

      boolean skipErrorLog = NullUtil.getOrElse(UrlParameterUtil.getParameter("noTestErrorLog"), "false").equals("true");

      log.info("Test results, " + results.passed + " have passed and " + results.failed + " have failed");
      ListUtil.forEachArrayValue(results.tests, (testI, testData) -> {
        ListUtil.forEachArrayValue(testData.methods, (testMethodI, testMethodData) -> {
          if (testMethodData.succeeded) {
            log.info("[PASSED] " + testData.name + "." + testMethodData.name);
          } else {
            log.error("[FAILED] " + testData.name + "." + testMethodData.name, !skipErrorLog ? testMethodData.error : null);
          }
        });
      });
    }
  }

  private TestExecutionResults callAllTests() {
    log.info("running game tests");

    TestExecutionResults results = new TestExecutionResults();

    results.failed = 0;
    results.passed = 0;
    results.runs = 0;
    results.tests = JSCollections.$array();

    ListUtil.forEachArrayValue(tests, (index, test) -> {
      TestClassResult testResults = callTestMethods(test);

      ListUtil.forEachArrayValue(testResults.methods, (resultIndex, resultData) -> {
        if (resultData.succeeded) {
          results.passed++;
        } else {
          results.failed++;
        }
        results.runs++;
      });

      results.tests.push(testResults);
    });

    log.info("completed game tests");
    return results;
  }

  private TestClassResult callTestMethods(Test test) {
    TestClassResult results = new TestClassResult();

    results.methods = JSCollections.$array();
    results.name = ClassUtil.getClassName(test);

    Object testProto = JSObjectAdapter.$prototype(JSObjectAdapter.$constructor(test));
    Array<String> properties = JsUtil.objectKeys(testProto);
    ListUtil.forEachArrayValue(properties, (index, property) -> {
      if (isTestCaseProperty(test, property)) {
        results.methods.push(callTestMethod(test, property));
      }
    });

    return results;
  }

  private TestMethodResult callTestMethod(Test test, String methodName) {
    TestMethodResult results = new TestMethodResult();

    results.name = methodName;
    try {
      invokeMethod(test, BEFORETEST_METHOD_NAME);
      invokeMethod(test, methodName);
      invokeMethod(test, AFTERTEST_METHOD_NAME);
      results.succeeded = true;
    } catch (Exception e) {
      results.succeeded = false;
      results.error = e;
    }

    return results;
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
