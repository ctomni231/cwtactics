package org.wolftec.cwt.core.util;

public abstract class AssertUtil {
  public static <T> T neverReached(String errMsg) {
    return JsUtil.throwError("AssertionFailed: reached unwanted code block -> " + errMsg);
  }

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
