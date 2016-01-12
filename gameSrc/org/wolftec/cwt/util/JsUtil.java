package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;

/**
 * Utility to handle special JavaScript stuff like errors or prototypes.
 */
public abstract class JsUtil
{

  /**
   * @param obj
   * @return a list of all own (non-prototype ones) properties from obj
   */
  public static Array<String> objectKeys(Object obj)
  {
    return JSObjectAdapter.$js("Object.keys(obj)");
  }

  public static <T> T throwError(String message)
  {
    JSObjectAdapter.$js("throw new Error(message)");

    /* we never reach this block but this makes a return type available */
    return null;
  }

  /**
   * @return time stamp for the current date as integer
   */
  public static long getTimestamp()
  {
    return JSObjectAdapter.$js("new Date().getTime()");
  }
}
