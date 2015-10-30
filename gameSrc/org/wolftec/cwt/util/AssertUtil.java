package org.wolftec.cwt.util;

import org.stjs.javascript.annotation.Native;
import org.wolftec.cwt.wotec.annotations.MayRaisesError;
import org.wolftec.cwt.wotec.annotations.OptionalParameter;

/**
 * Simple and small utility class to handle with assertions.
 */
public abstract class AssertUtil {

  @MayRaisesError("when called")
  public static <T> T neverReached(String errMsg) {
    return JsUtil.throwError("AssertionFailed: reached unwanted code block -> " + errMsg);
  }

  @Native
  @MayRaisesError("when value resolves to false")
  public static void assertThat(boolean value) {
  }

  @MayRaisesError("when value resolves to false")
  public static void assertThat(boolean value, @OptionalParameter String errMsg) {
    if (!value) {
      JsUtil.throwError(NullUtil.getOrElse("AssertionFailed: " + value, "AssertionFailed"));
    }
  }

  @Native
  @MayRaisesError("when value resolves to true")
  public static void assertThatNot(boolean value) {
  }

  @MayRaisesError("when value resolves to true")
  public static void assertThatNot(boolean value, @OptionalParameter String errMsg) {
    if (value) {
      JsUtil.throwError(NullUtil.getOrElse("AssertionFailed: " + value, "AssertionFailed"));
    }
  }
}
