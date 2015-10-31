package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.system.annotations.OptionalReturn;

public abstract class UrlParameterUtil {

  private static Map<String, String> urlParameters;

  private static void parseParameterMap() {
    urlParameters = JSCollections.$map();
    Array<String> parts = JSStringAdapter.split(Global.window.document.location.search.substring(1), "&");

    for (int i = 0; i < parts.$length(); i++) {
      Array<String> nv = JSStringAdapter.split(parts.$get(i), "=");
      if (!((boolean) ((Object) nv.$get(0)))) {
        continue;
      }
      urlParameters.$put(nv.$get(0), (String) JSGlobal.$or(nv.$get(1), true));
    }
  }

  public static Map<String, String> getParameters() {
    if (!NullUtil.isPresent(urlParameters)) {
      parseParameterMap();
    }
    return urlParameters;
  }

  /**
   * 
   * @param param
   *          the parameter key
   * @return the value for the given parameter
   */
  @OptionalReturn
  public static String getParameter(String param) {
    return getParameters().$get(param);
  }
}
