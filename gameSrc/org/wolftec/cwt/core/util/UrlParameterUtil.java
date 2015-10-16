package org.wolftec.cwt.core.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.Option;

public abstract class UrlParameterUtil {

  private static Map<String, String> urlParameters;

  /**
   * 
   * @return a map with parameters
   */
  public static Map<String, String> getParameters() {
    if (urlParameters == null) {
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
    return urlParameters;
  }

  /**
   * 
   * @param param
   *          the parameter key
   * @return the value for the given parameter
   */
  public static Option<String> getParameter(String param) {
    String value = getParameters().$get(param);
    return Option.ofNullable(value);
  }
}
