package org.wolftec.cwt.core.javascript;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback1;

public abstract class ReflectionUtil {

  public static <T> T createInstance(Class<T> type) {
    return JSObjectAdapter.$js("new type()");
  }

  public static <T> void forEachClassOfType(Class<T> type, Callback1<Class<T>> iterator) {
    // TODO FIXME
  }
}
