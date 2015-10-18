package org.wolftec.cwt.core.util;

import org.stjs.javascript.JSGlobal;

public abstract class NullUtil {

  public static boolean isPresent(Object value) {
    return value != null && value != JSGlobal.undefined;
  }

  public static <T> T getOrElse(T value, T defValue) {
    return isPresent(value) ? value : defValue;
  }

  public static void mustBePresent(Object value, String undefError) {
    if (!isPresent(value)) {
      JsUtil.throwError("ValueNotPresentException: " + undefError);
    }
  }

  public static void mustNotBePresent(Object value, String undefError) {
    if (isPresent(value)) {
      JsUtil.throwError("ValueNotPresentException: " + undefError);
    }
  }
}
