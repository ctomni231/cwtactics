package org.wolftec.cwt.core.javascript;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.annotations.OptionalField;

/**
 * Utility class which contains a lot of browser environment related functions.
 */
public abstract class RequestUtil {

  @STJSBridge
  public static interface ArrayBufferRespone {
  }

  public static class ResponseData<T> {

    @OptionalField public T data;

    @OptionalField public String error;
  }

  /**
   * 
   * @param path
   * @param callback
   */
  public static void getText(String path, Callback1<ResponseData<String>> callback) {
    final XMLHttpRequest request = new XMLHttpRequest();

    request.onreadystatechange = () -> {
      if (request.readyState == 4) {
        ResponseData<String> response = new ResponseData<>();

        String err = null;
        String data = null;

        if (request.readyState == 4 && request.status == 200) {
          data = request.responseText;
        } else {
          err = request.statusText;
        }

        response.data = data;
        response.error = err;

        callback.$invoke(response);
      }
    };

    // create a randomized parameter for the URL to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }

  /**
   * 
   * @param path
   * @param callback
   */
  public static <T> void getJSON(String path, Callback1<T> onFinished, Callback1<String> onError) {
    final XMLHttpRequest request = new XMLHttpRequest();

    request.onreadystatechange = () -> {
      if (request.readyState == 4) {
        if (request.readyState == 4 && request.status == 200) {
          T data = null;
          try {
            data = (T) Global.JSON.parse(request.responseText);
          } catch (Exception e) {
            onError.$invoke(e.toString());
          }
          onFinished.$invoke(data);
        } else {
          onError.$invoke(request.statusText);
        }
      }
    };

    // create a randomized parameter for the URL to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }

  /**
   * 
   * @param path
   * @param callback
   */
  public static void getArrayBuffer(String path, Callback1<ResponseData<ArrayBufferRespone>> callback) {
    final XMLHttpRequest request = new XMLHttpRequest();

    JSObjectAdapter.$js("request.responseType = 'arraybuffer'");
    request.onreadystatechange = () -> {
      if (request.readyState == 4) {
        ResponseData<ArrayBufferRespone> response = new ResponseData<>();

        String err = null;
        ArrayBufferRespone data = null;

        if (request.readyState == 4 && request.status == 200) {
          data = JSObjectAdapter.$js("request.response");
        } else {
          err = request.statusText;
        }

        response.data = data;
        response.error = err;

        callback.$invoke(response);
      }
    };

    // create a randomized parameter for the URL to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }
}
