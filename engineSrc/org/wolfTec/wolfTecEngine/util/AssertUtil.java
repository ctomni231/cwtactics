package org.wolfTec.wolfTecEngine.util;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.wolfTecEngine.components.JsExec;

/**
 * 
 */
public abstract class AssertUtil {

  /**
   * 
   * @param object
   * @param property
   */
  public static void hasNoProperty(Object object, String property) {
    if ((boolean) JsExec.injectJS("object.hasOwnProperty(property)")) {
      JSGlobal.stjs.exception("AssertionException");
    }
  }
}
