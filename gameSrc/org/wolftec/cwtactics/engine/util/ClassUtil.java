package org.wolftec.cwtactics.engine.util;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;

public class ClassUtil {

  public static String getClassName(Object object) {
    if (object == null || object == JSGlobal.undefined) {
      return null;
    }
    return (String) JSObjectAdapter.$get(object, "__className");
  }
}
