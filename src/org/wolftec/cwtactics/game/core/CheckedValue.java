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

  public T getOrElseByProviders(Array<Function0<T>> providers) {
    if (!isPresent()) {
      for (int i = 0; i < providers.$length(); i++) {
        T value = providers.$get(i).$invoke();
        if (value != null) {
          return value;
        }
      }
      return JsUtil.throwError("IllegalArgument");
    }

    return i_value;
  }

  public T getOrThrow(String error) {
    if (!isPresent()) {
      return JsUtil.throwError(error);

    } else {
      return i_value;
    }
  }

  public static <T> CheckedValue<T> of(T value) {
    return new CheckedValue<T>(value);
  }
}
