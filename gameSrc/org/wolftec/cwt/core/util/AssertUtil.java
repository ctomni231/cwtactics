package org.wolftec.cwt.core.util;

public abstract class AssertUtil {

  public static void assertThat(boolean value, String errMsg) {
    if (!value) {
      JsUtil.throwError("AssertionFailed: " + errMsg);
    }
  }

  public static void assertThatNot(boolean value, String errMsg) {
    if (value) {
      JsUtil.throwError("AssertionFailed: " + errMsg);
    }
  }
}
