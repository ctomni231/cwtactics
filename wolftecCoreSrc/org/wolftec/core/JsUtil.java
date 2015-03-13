package org.wolftec.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;

public abstract class JsUtil {

  /**
   * 
   * @param object
   * @param property
   * @return
   */
  public static <T> T getPropertyValue(Object object, String property) {
    return JsExec.injectJS("object[property]");
  }

  public static boolean hasProperty(Object object, String property) {
    return JsExec.injectJS("object.hasOwnProperty(property)");
  }

  public static boolean isTruly(Object object) {
    return JsExec.injectJS("object == true");
  }

  public static boolean isString(Object object) {
    return JSGlobal.typeof(object) == "string";
  }

  public static boolean notUndef(Object object) {
    return JSGlobal.undefined != object;
  }

  /**
   * 
   * @param bean
   * @return
   */
  public static String getBeanName(Object bean) {
    String name = JsExec.injectJS("object['$cwt$beanName']");
    if ((boolean) JsExec.injectJS("typeof name == 'string'")) {
      return name;
    }

    JSGlobal.stjs.exception("object seems not to be a bean");
    return null;
  }
  
  public static Array<String> getObjectKeys(Object value) {
    return JsExec.injectJS("Object.keys(value)");
  }
  
  /**
   * 
   * @param clazz
   * @return
   */
  public static <T> T createInstance(Class<T> clazz) {
    return JsExec.injectJS("new clazz()");
  }
  
  public static void raiseError(String msg, Object... args) {
    JSGlobal.stjs.exception(msg); // TODO args
  }
  
  public static Array<String> splitString(String str, String splitter) {
    return JsExec.injectJS("str.split(splitter)");
  }
}
