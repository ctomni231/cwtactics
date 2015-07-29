package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.Map;

public class UrlParameterUtil {
  // TODO realize as managed object
  private static Map<String, String> urlParameters;

  public static Map<String, String> getUrlParameterMap() {
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

  public static String getUrlParameter(String param) {
    String value = getUrlParameterMap().$get(param);
    return value != JSGlobal.undefined ? value : null;
  }
}
