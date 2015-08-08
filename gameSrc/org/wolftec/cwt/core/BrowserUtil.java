package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback2;

/**
 * Utility class which contains a lot of browser environment related functions.
 */
public abstract class BrowserUtil {

  /**
   * 
   * @param path
   * @param callback
   *          (data, error)
   */
  public static void requestJsonFile(String path, Callback2<Object, Object> callback) {
    doXmlHttpRequest(path, null, (data, error) -> {
      Object dataMap = null;

      if (error == null) {
        dataMap = JSGlobal.JSON.parse((String) data);
      }

      callback.$invoke(dataMap, error);
    });
  }

  /**
   * Invokes a XmlHttpRequest.
   * 
   * @param path
   * @param specialType
   *          null or a special binary response type like array buffer
   * @param callback
   *          callback will be invoked with two parameters => object data and
   *          error message (both aren't not null at the same time)
   */
  public static void doXmlHttpRequest(String path, String specialType, Callback2<Object, String> callback) {

    final XMLHttpRequest request = new XMLHttpRequest();

    // needed to load special response types like array buffers
    if (specialType != null) {
      JSObjectAdapter.$put(request, "responseType", specialType);
    }

    request.onreadystatechange = new Callback0() {
      @Override
      public void $invoke() {
        if (request.readyState == 4) {
          if (request.readyState == 4 && request.status == 200) {
            if (specialType != null) {
              callback.$invoke(JSObjectAdapter.$get(request, "response"), null);
            } else {
              callback.$invoke(request.responseText, null);
            }
          } else {
            callback.$invoke(null, request.statusText);
          }
        }
      }
    };

    // TODO create a randomized parameter for the URL to make sure it won't be
    // cached
    request.open("get", path, true);

    request.send();
  }

  /**
   * Creates a DOM element.
   * 
   * @param tag
   *          name of the tag
   * @return a DOM element with the given tag
   */
  public static <T extends Element> T createDomElement(String tag) {
    return JSObjectAdapter.$js("document.createElement(tag)");
  }

  /**
   * 
   * @param handler
   */
  public static void requestAnimationFrame(Callback0 handler) {
    JSObjectAdapter.$js("requestAnimationFrame(handler)");
  }

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
