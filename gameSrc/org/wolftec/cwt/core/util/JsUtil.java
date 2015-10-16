package org.wolftec.cwt.core.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.RegExp;
import org.stjs.javascript.functions.Callback0;

public abstract class JsUtil {

  public static boolean isEmptyFunction(Object fn) {
    if (JSGlobal.typeof(fn) != "function") {
      return false;
    }

    String content = fn.toString();
    RegExp regA = JSObjectAdapter.$js("/\\{([\\s\\S]*)\\}/m");
    RegExp regB = JSObjectAdapter.$js("/^\\s*\\/\\/.*$/mg");
    Array<String> matches = JSStringAdapter.match(content, regA);
    content = JSStringAdapter.replace(matches.$get(1), regB, "");
    return content.trim().length() == 0;
  }

  public static Array<String> objectKeys(Object obj) {
    return JSObjectAdapter.$js("Object.keys(obj)");
  }

  public static <T> T throwError(String message) {
    JSObjectAdapter.$js("throw new Error(message)");
    return null; // never reached
  }

  /**
   * Requests an animation frame and tries to call handler every 16ms.
   * 
   * @param handler
   */
  public static void requestAnimationFrame(Callback0 handler) {
    JSObjectAdapter.$js("requestAnimationFrame(handler)");
  }

  /**
   * 
   * @return time stamp for the current date as integer
   */
  public static long getTimestamp() {
    return JSObjectAdapter.$js("new Date().getTime()");
  }
}
