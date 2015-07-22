package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;

public abstract class ClassUtil {

  private static final String PARAM_INHERIT          = "$inherit";
  private static final String PARAM_TYPE_DESCRIPTION = "$typeDescription";
  private static final String PROPERTY_CLASS_NAME    = "__className__";

  public static void initClassNames(Object namespace) {
    forEachClassOfNamespace(namespace, (className, constructor) -> {
      if (getClassName(constructor) == null) {
        JSObjectAdapter.$put(constructor, PROPERTY_CLASS_NAME, className);
        JSObjectAdapter.$put(JSObjectAdapter.$prototype(constructor), PROPERTY_CLASS_NAME, className);
      }
    });
  }

  public static void forEachClassInstanceProperty(Object object, Callback2<String, Object> callback) {
    JsUtil.forEachMapValue(JSObjectAdapter.$prototype(JSObjectAdapter.$constructor(object)), (prop, defValue) -> {

      /*
       * normal iteration through the class prototype object map will return the
       * default prototype property values, but we need to call the callback
       * with the actual object values
       */
      callback.$invoke(prop, JSObjectAdapter.$get(object, prop));
    });
  }

  public static void forEachClassProperty(Class<?> clazz, Callback2<String, Object> callback) {
    JsUtil.forEachMapValue(JSObjectAdapter.$prototype(clazz), (prop, defValue) -> {

      /*
       * normal iteration through the class prototype object map will return the
       * default prototype property values, but we need to call the callback
       * with the actual object values
       */
      callback.$invoke(prop, JSObjectAdapter.$get(clazz, prop));
    });
  }

  public static String getClassName(Object object) {
    if (object == null || object == JSGlobal.undefined) {
      return null;
    }
    return (String) JSObjectAdapter.$get(object, PROPERTY_CLASS_NAME);
  }

  public static Class<?> getClass(Object object) {
    return (Class<?>) JSObjectAdapter.$constructor(object);
  }

  public static <T> T newInstance(Class<T> clazz) {
    return JSObjectAdapter.$js("new clazz()");
  }

  public static void forEachInterface(Class<?> classObj, Callback1<Class<?>> callback) {
    JsUtil.forEachArrayValue((Array<Class<?>>) JSObjectAdapter.$get(classObj, PARAM_INHERIT), (index, interfaceObj) -> {
      callback.$invoke(interfaceObj);
    });
  }

  /**
   * Searches for the interface in a class hierarchy. At the moment the class
   * has to implement an interface which extends the interface in it's own
   * hierarchy to be recognized.
   * 
   * @param classObj
   *          class that will be checked
   * @return true when the class object is a constructed class, else false
   */
  public static boolean classImplementsInterface(Class<?> classObj, Class<?> interfaceObj) {
    if (JSObjectAdapter.hasOwnProperty(classObj, PARAM_TYPE_DESCRIPTION)) {
      Array<Class<?>> interfaces = (Array<Class<?>>) JSObjectAdapter.$get(classObj, PARAM_INHERIT);

      if (interfaces.indexOf(interfaceObj) != -1) {
        return true;
      }

      // if the constructed class isn't directly implemented, then check all
      // implemented interfaces, which may extends the constructed class
      // interface
      for (int i = 0; i < interfaces.$length(); i++) {
        Class<?> currentInterfaceObj = interfaces.$get(i);
        if (classImplementsInterface(currentInterfaceObj, interfaceObj)) {
          return true;
        }
      }
    }
    return false;
  }

  public static Class<?> getClassPropertyType(Class<?> classObject, String property) {
    Object classDesc = JSObjectAdapter.$get(classObject, PARAM_TYPE_DESCRIPTION);
    String typeName = (String) JSObjectAdapter.$get(classDesc, property);

    if (JSGlobal.typeof(typeName) != "string") {
      typeName = (String) JSObjectAdapter.$get(typeName, "name");
    }

    Array<String> namePieces = JSStringAdapter.split(typeName, ".");
    return getTypeByNamespace(namePieces);
  }

  public static Class<?> getClassPropertySubType(Class<?> classObject, String property) {
    Object classDesc = JSObjectAdapter.$get(classObject, PARAM_TYPE_DESCRIPTION);
    String typeName = (String) JSObjectAdapter.$get(classDesc, property);

    if (JSGlobal.typeof(typeName) == "string") {
      return JsUtil.throwError("NoSubType");
    }

    typeName = ((Array<String>) JSObjectAdapter.$get(typeName, "arguments")).$get(0);
    return getTypeByNamespace(JSStringAdapter.split(typeName, "."));
  }

  private static Class<?> getTypeByNamespace(Array<String> namePieces) {
    Object result = Global.window;

    for (int i = 0; i < namePieces.$length(); i++) {
      result = JSObjectAdapter.$get(result, namePieces.$get(i));
      if (!CheckedValue.of(result).isPresent()) {
        return JsUtil.throwError("UnknownPropertyType");
      }
    }

    return (Class<?>) result;
  }

  public static void forEachClassOfNamespace(Object namespace, Callback2<String, Class<?>> callback) {
    JsUtil.forEachArrayValue(JsUtil.objectKeys(namespace), (index, className) -> {
      Class<?> classObject = (Class<?>) JSObjectAdapter.$get(namespace, className);
      if (CheckedValue.of(JSObjectAdapter.$get(classObject, PARAM_TYPE_DESCRIPTION)).isPresent()) {
        callback.$invoke(className, classObject);
      }
    });
  }
}
