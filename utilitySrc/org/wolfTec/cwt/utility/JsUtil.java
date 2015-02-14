package org.wolfTec.cwt.utility;

import org.stjs.javascript.JSObjectAdapter;

public class JsUtil {

  public static <T> T getPropertyValue(Object object, String property) {
    return (T) JSObjectAdapter.$get(object, property);
  }
  
  public static <T> T evalJs(String code) {
    return JSObjectAdapter.$js(code);
  }
}
