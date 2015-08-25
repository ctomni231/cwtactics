package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.JsUtil;

@Deprecated
public class Nullable {

  /**
   * Calls cb if value is defined.
   * 
   * @param value
   * @param cb
   */
  public static <T> void ifPresent(T value, Callback1<T> cb) {
    if (isDefined(value)) {
      cb.$invoke(value);
    }
  }

  /**
   * Calls thenCb(value) if value is defined, else elseCb.
   * 
   * @param value
   * @param thenCb
   * @param elseCb
   */
  public static <T> void ifPresentOrElse(T value, Callback1<T> thenCb, Callback0 elseCb) {
    if (isDefined(value)) {
      thenCb.$invoke(value);
    } else {
      elseCb.$invoke();
    }
  }

  /**
   * 
   * @param value
   * @return true is value is defined, else false
   */
  public static <T> boolean isPresent(T value) {
    return isDefined(value);
  }

  /**
   * 
   * @param value
   * @param whenNull
   * @return value when defined or whenNull
   */
  public static <T> T getOrElse(T value, T whenNull) {
    return isDefined(value) ? value : whenNull;
  }

  /**
   * 
   * @param value
   * @param error
   * @return value if defined
   * @throws error
   *           when value is not defined
   */
  public static <T> T getOrThrow(T value, String error) {
    if (!isDefined(value)) {
      JsUtil.throwError(error);
    }
    return value;
  }

  private static boolean isDefined(Object obj) {
    return obj != null && obj != JSGlobal.undefined;
  }
}
