package org.wolftec.cwtactics.game.system.old;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class BrowserService implements ConstructedClass {

  @Deprecated
  public void requestJsonFile(String path, Callback2<String, Object> callback) {
    // TODO
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
  @Deprecated
  public void doXmlHttpRequest(String path, String specialType, Callback2<Object, String> callback) {

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
}
