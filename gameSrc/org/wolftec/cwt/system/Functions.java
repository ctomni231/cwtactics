package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function0;

public class Functions {

  public static Callback0 emptyFunction() {
    return (() -> {
    });
  }

  public static Function0<Boolean> trueReturner() {
    return (() -> true);
  }

  public static <T> Array<T> createListByClass(Class<T> clazz, int size) {
    Array<T> list = JSCollections.$array();

    while (size > 0) {
      list.push(ClassUtil.newInstance(clazz));
      size--;
    }

    return list;
  }

  /**
   * Calls a function lazy. This means the factory function fn will be called
   * when the curried function (return value) will be called the first time. The
   * factory function needs to return the value that should be returned by the
   * curried function in future.
   * 
   * @param fn
   * @return
   */
  public static <T> Function0<T> lazy(Function0<T> fn) {
    T value = null;
    return () -> {
      return Nullable.isPresent(value) ? value : fn.$invoke();
    };
  }

  // Repeats a given function **f** for **n** times.
  //
  public static void repeat(int n, Callback1<Integer> f) {
    for (int i = 0; i < n; i++) {
      f.$invoke(i);
    }
  }

}
