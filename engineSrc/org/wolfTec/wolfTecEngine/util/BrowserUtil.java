package org.wolfTec.wolfTecEngine.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.components.JsExec;

/**
 * Utility class which contains a lot of browser environment related functions.
 */
public abstract class BrowserUtil {

  /**
   * Converts a canvas object to a base64 string.
   * 
   * @param image
   * @return
   */
  public static String convertCanvasToBase64(Canvas image) {
    return JsExec.injectJS("Base64Helper.canvasToBase64(image)");
  }

  /**
   * Converts a base64 string to a canvas object.
   * 
   * @param imageData
   * @return
   */
  public static Element convertBase64ToImage(String imageData) {
    return JsExec.injectJS("Base64Helper.base64ToImage(image)");
  }

  /**
   * 
   * @param imageData
   * @return
   */
  public static Element convertArrayBufferToBase64(Object data) {
    return JsExec.injectJS("Base64Helper.encodeBuffer(data)");
  }

  /**
   * 
   * @param imageData
   * @return
   */
  public static Element convertBase64ToArrayBuffer(String data) {
    return JsExec.injectJS("Base64Helper.decodeBuffer(data)");
  }

  /**
   * 
   * @param param
   * @return
   */
  public static String getUrlParameter(String param) {
    Object parameter = JsExec.injectJS("getURLQueryParams(document.location.search)[param]");
    return JsExec.injectJS("parameter !== undefined? parameter : null");
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
  public static void doXmlHttpRequest(String path, String specialType,
      Callback2<Object, String> callback) {

    final XMLHttpRequest request = new XMLHttpRequest();

    // needed to load special response types like array buffers
    if (specialType != null) {
      JsExec.injectJS("request.responseType = type");
    }

    request.onreadystatechange = new Callback0() {
      @Override
      public void $invoke() {
        if (request.readyState == 4) {
          if (request.readyState == 4 && request.status == 200) {
            if (specialType != null) {
              callback.$invoke(JsExec.injectJS("request.response"), null);
            } else {
              callback.$invoke(request.responseText, null);
            }
          } else {
            callback.$invoke(null, request.statusText);
          }
        }
      }
    };

    // create a randomized parameter for the url to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }

  /**
   * 
   * @param functions
   * @param finalCallback
   */
  public static void executeSeries(Array<Callback1<Callback0>> functions, Callback0 finalCallback) {
    JsExec.injectJS("R.series(functions, finalCallback)");
  }

  /**
   * Creates a DOM element.
   * 
   * @param tag
   *          name of the tag
   * @return a DOM element with the given tag
   */
  public static <T extends Element> T createDomElement(String tag) {
    return JsExec.injectJS("document.createElement(tag)");
  }

  /**
   * 
   * @param handler
   */
  public static void requestAnimationFrame(Callback0 handler) {
    JsExec.injectJS("requestAnimationFrame(handler)");
  }
}
