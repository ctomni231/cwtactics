package org.wolftec.cwtactics.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;

/**
 * JavaScript utility class to do some basic stuff with objects.
 */
public abstract class JSU {

  /**
   * 
   * @param object
   * @return true when object resolves to true in an expression
   */
  public static boolean isTruly(Object object) {
    return JSEU.injectJS("object == true");
  }

  /**
   * 
   * @param object
   * @return true when object is a string
   */
  public static boolean isString(Object object) {
    return JSGlobal.typeof(object) == "string";
  }

  /**
   * 
   * @param object
   * @return true of object is not undefined
   */
  public static boolean notUndef(Object object) {
    return JSGlobal.undefined != object;
  }

  /**
   * 
   * @param lValue
   * @param lFallbackValue
   * @return
   */
  public static <T> T extractValue(T lValue, T lFallbackValue) {
    return notUndef(lValue) ? lValue : lFallbackValue;
  }

  public static <T> T fromJSON(String value) {
    return (T) JSGlobal.JSON.parse(value);
  }

  public static String toJSON(Object value) {
    return JSGlobal.JSON.stringify(value);
  }

  /**
   * Throws a JavaScript error.
   * 
   * @param msg
   */
  public static void raiseError(String msg) {
    JSGlobal.stjs.exception(msg);
  }

  /**
   * Throws a JavaScript error.
   * 
   * @param lErrorMsg
   */
  public static void raiseErrorWhenNotNull(Object lValueToTest, String lErrorMsg) {
    if (lValueToTest != null) {
      JSGlobal.stjs.exception(lErrorMsg);
    }
  }

  /**
   * Splits a string by an delimiter into an array of sub strings.s
   * 
   * @param str
   * @param splitter
   * @return
   */
  public static Array<String> splitString(String str, String splitter) {
    return JSEU.injectJS("str.split(splitter)");
  }
}
