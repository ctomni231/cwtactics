package org.wolftec.cwt.util;

import org.stjs.javascript.Global;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.functions.Callback1;

/**
 * Utility class which contains a lot of browser environment related functions.
 */
public abstract class RequestUtilNew
{

  public static <T> void getJSON(String path, Callback1<T> whenLoaded, Callback1<String> whenFailed)
  {
    final XMLHttpRequest request = new XMLHttpRequest();

    request.onreadystatechange = () ->
    {
      if (request.readyState == 4)
      {
        String err = null;
        T data = null;

        if (request.readyState == 4 && request.status == 200)
        {
          try
          {
            data = (T) Global.JSON.parse(request.responseText);
          }
          catch (Exception e)
          {
            err = e.toString();
          }
        }
        else
        {
          err = request.statusText;
        }

        if (err != null)
        {
          whenFailed.$invoke(err);
        }
        else
        {
          whenLoaded.$invoke(data);
        }
      }
    };

    // create a randomized parameter for the URL to make sure it won't be cached
    request.open("get", path, true);

    request.send();
  }

}
