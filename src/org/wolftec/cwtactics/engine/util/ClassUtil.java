package org.wolftec.cwtactics.engine.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

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

  public static <T> T newInstance(Class<T> clazz) {
    return JSObjectAdapter.$js("new clazz()");
  }

  public static void forEachPrototypeProperty(Object obj) {
    Object constructor = JSObjectAdapter.$constructor(obj);
    Map<String, Object> prototype = JSObjectAdapter.$prototype(obj);
    Object types = JSObjectAdapter.$get(constructor, "$typeDescription");

    JsUtil.forEachMapValue(prototype, (property, value) -> {
      Object typeData = JSObjectAdapter.$get(types, property);
    });
  }
}
