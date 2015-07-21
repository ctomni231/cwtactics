package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class CheckedValue<T> {

  private T i_value;

  public CheckedValue(T value) {
    i_value = value;
  }

  public boolean isPresent() {
    return i_value != null && i_value != JSGlobal.undefined;
  }

  public T get() {
    if (!isPresent()) {
      return JsUtil.throwError("ElementNotDefined");

    } else {
      return i_value;
    }
  }

  public T getOrElse(T value) {
    if (!isPresent()) {
      if (value == null || value == JSGlobal.undefined) {
        return JsUtil.throwError("IllegalArgument");

      } else {
        return value;
      }
    } else {
      return i_value;
    }
  }

  public T getOrElseByProvider(Function0<T> provider) {
    return !isPresent() ? provider.$invoke() : i_value;
  }

  /**
   * Throws an error when the checked value isn‘t defined and no provider
   * returns a value.
   * 
   * @param providers
   * @return value of the {@link CheckedValue} object or a value of the given
   *         provider functions
   */
  public T getOrElseByProviders(Array<Function0<T>> providers) {
    if (!isPresent()) {
      for (int i = 0; i < providers.$length(); i++) {
        T value = providers.$get(i)
                           .$invoke();
        if (value != null) {
          return value;
        }
      }
      return JsUtil.throwError("IllegalArgument");
    }

    return i_value;
  }

  /**
   * 
   * @param error
   *          that will be raised when the checked value is null or undefined
   * @return checked value
   */
  public T getOrThrow(String error) {
    if (!isPresent()) {
      return JsUtil.throwError(error);

    } else {
      return i_value;
    }
  }

  /**
   * 
   * @param value
   * @return {@link CheckedValue} object of the given value
   */
  public static <T> CheckedValue<T> of(T value) {
    return new CheckedValue<T>(value);
  }
}
