package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.wolftec.cwt.core.JsUtil;

public class Maybe<T> {

  public static final Maybe<Object> NOTHING = new Maybe<Object>(null);

  public static <M> Maybe<M> of(M value) {
    return new Maybe<M>(value);
  }

  private T value;

  public Maybe(T value) {
    this.value = value;
  }

  public T get() {
    if (!isPresent()) {
      return JsUtil.throwError("Maybe contains no value");
    }
    return value;
  }

  public boolean isPresent() {
    return value != null && value != JSGlobal.undefined;
  }
}
