package org.wolftec.cwt.core.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Function0;

public abstract class NullUtil {

  public static boolean isPresent(Object value) {
    return value != null && value != JSGlobal.undefined;
  }

  public static <T> T getOrElse(T value, T defValue) {
    return isPresent(value) ? value : defValue;
  }

  public static <T> T getOrElseByProvider(T value, Function0<T> defValueProvider) {
    return isPresent(value) ? value : defValueProvider.$invoke();
  }

  public static <T> T mustBePresent(T value, String undefError) {
    if (!isPresent(value)) {
      JsUtil.throwError("ValueNotPresentException: " + undefError);
    }
    return value;
  }

  public static void mustNotBePresent(Object value, String undefError) {
    if (isPresent(value)) {
      JsUtil.throwError("ValueNotPresentException: " + undefError);
    }
  }
}
