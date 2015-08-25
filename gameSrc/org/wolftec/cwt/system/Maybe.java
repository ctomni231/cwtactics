package org.wolftec.cwt.system;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwt.core.JsUtil;

@Deprecated
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

  public void ifPresent(Callback1<T> thenCb) {
    if (isPresent()) {
      thenCb.$invoke(value);
    }
  }

  public void ifPresentOrElseDo(Callback1<T> thenCb, Callback0 elseCb) {
    if (isPresent()) {
      thenCb.$invoke(value);
    } else {
      elseCb.$invoke();
    }
  }

  public T orElse(T elseValue) {
    if (!isPresent()) {
      return elseValue;
    }
    return value;
  }

  public T orElseThrow(String error) {
    if (!isPresent()) {
      return JsUtil.throwError(error);
    }
    return value;
  }

  public T orElseByProvider(Function0<T> provider) {
    if (!isPresent()) {
      return provider.$invoke();
    }
    return value;
  }

  public T orElseDo(Callback0 doCb) {
    if (!isPresent()) {
      doCb.$invoke();
    }
    return value;
  }

  public boolean isPresent() {
    return value != null && value != JSGlobal.undefined;
  }
}
