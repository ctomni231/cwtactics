package org.wolftec.cwt.util;

import java.util.Optional;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwt.wotec.annotations.MayRaisesError;

/**
 * This utility class is heavily inspired by {@link Optional} but uses a non
 * class instance based approach to realize it's functionality.
 */
public abstract class NullUtil {

  /**
   * 
   * @param value
   * @return true when value is neither null nor undefined, else false
   */
  public static boolean isPresent(Object value) {
    return value != null && value != JSGlobal.undefined;
  }

  /**
   * 
   * @param value
   * @param defValue
   * @return value if present or defValue if not
   */
  public static <T> T getOrElse(T value, T defValue) {
    return isPresent(value) ? value : defValue;
  }

  /**
   * 
   * @param value
   * @param defValueProvider
   * @return value if present or the return value of defValueProvider if not
   */
  public static <T> T getOrElseByProvider(T value, Function0<T> defValueProvider) {
    return isPresent(value) ? value : defValueProvider.$invoke();
  }

  @MayRaisesError("when value is present")
  public static <T> T getOrThrow(T value) {
    if (!isPresent(value)) {
      JsUtil.throwError("ValueNotPresentException");
    }
    return value;
  }
}
