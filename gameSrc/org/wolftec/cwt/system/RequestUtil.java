package org.wolftec.cwt.system;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback2;

/**
 * Utility class which contains a lot of browser environment related functions.
 */
public abstract class RequestUtil {

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
      JSObjectAdapter.$js("request.responseType = type");
    }

    request.onreadystatechange = new Callback0() {
      @Override
      public void $invoke() {
        if (request.readyState == 4) {
          if (request.readyState == 4 && request.status == 200) {
            if (specialType != null) {
              callback.$invoke(JSObjectAdapter.$js("request.response"), null);
            } else {
              callback.$invoke(request.responseText, null);
            }
          } else {
            callback.$invoke(null, request.statusText);
          }
        }
      }
    };

    // create a randomized parameter for the URL to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }
}
