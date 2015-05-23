package org.wolftec.cwtactics.engine.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;

public abstract class ClassUtil {

  public static String getClassName(Object object) {
    if (object == null || object == JSGlobal.undefined) {
      return null;
    }
    return (String) JSObjectAdapter.$get(object, "__className");
  }

  public static Class<?> getClass(Object object) {
    return (Class<?>) JSObjectAdapter.$constructor(object);
  }
}
