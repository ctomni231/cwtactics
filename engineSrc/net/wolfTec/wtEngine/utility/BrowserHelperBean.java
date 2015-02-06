package net.wolfTec.wtEngine.utility;

import static org.stjs.javascript.JSObjectAdapter.$js;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public class BrowserHelperBean {

  /**
   * Converts a canvas object to a base64 string.
   * 
   * @param image
   * @return
   */
  public String convertCanvasToBase64(Canvas image) {
    return $js("Base64Helper.canvasToBase64(image)");
  }

  /**
   * Converts a base64 string to a canvas object.
   * 
   * @param imageData
   * @return
   */
  public Element convertBase64ToImage(String imageData) {
    return $js("Base64Helper.base64ToImage(image)");
  }

  /**
   * 
   * @param param
   * @return
   */
  public String getUrlParameter(String param) {
    Object parameter = $js("getURLQueryParams(document.location.search)[param]");
    return $js("parameter !== undefined? parameter : null");
  }

  /**
   *
   * @param options
   */
  public void doHttpRequest(final ExternalRequestOptions options) {

    final XMLHttpRequest request = new XMLHttpRequest();
    request.onreadystatechange = new Callback0() {
      @Override public void $invoke() {
        if (request.readyState == 4) {
          if (request.readyState == 4 && request.status == 200) {
            if (options.json) {
              Object arg = null;
              try {
                arg = JSGlobal.JSON.parse(request.responseText);
              } catch (Exception e) {
                options.error.$invoke(e);
              }
              options.success.$invoke(arg);
            } else {
              options.success.$invoke(request.responseText);
            }
          } else {
            options.error.$invoke(request.statusText);
          }
        }
      }
    };

    // create a randomized parameter for the url to make sure it won't be cached
    request.open("get", options.path + "?_wtEngRnd=" + JSGlobal.parseInt(10000 * Math.random(), 10), true);

    request.send();
  }
  
  public void executeSeries (Array<Callback1<Callback0>> functions, Callback0 finalCallback) {
    $js("R.series(functions, finalCallback)");
  }
}
