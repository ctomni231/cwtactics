package org.wolftec.cwt.core.util;

import java.util.Optional;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwt.core.annotations.MayRaisesError;
import org.wolftec.cwt.core.annotations.OptionalParameter;

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

  /**
   * @see getOrThrow(value,error)
   * @param value
   * @return
   */
  @Native
  public static <T> T getOrThrow(T value) {
    return null; // ...native...
  }

  @MayRaisesError("when value is not present")
  public static <T> T getOrThrow(T value, @OptionalParameter String error) {
    AssertUtil.assertThat(isPresent(value), getOrElse(error, "ValueNotPresentException"));
    return value;
  }

  /**
   * @see mayNotPresent(value,error)
   * @param value
   */
  @Native
  public static void mayNotPresent(Object value) {
  }

  @MayRaisesError("when value is present")
  public static void mayNotPresent(Object value, @OptionalParameter String error) {
    AssertUtil.assertThat(!isPresent(value), getOrElse(error, "ValuePresentException"));
  }
}
