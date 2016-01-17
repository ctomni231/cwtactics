package org.wolftec.cwt.collection;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwt.annotations.Async;
import org.wolftec.cwt.annotations.AsyncCallback;
import org.wolftec.cwt.util.JsUtil;

public abstract class ListUtil
{

  @SyntheticType
  private static class WorkflowData
  {
    int completed;
    Callback0 mainCb;
  }

  /**
   * 
   * @param clazz
   * @param size
   * @return
   */
  public static <T> Array<T> instanceList(Class<T> clazz, int size)
  {
    if (size <= 0)
    {
      JsUtil.throwError("illegal size");
    }

    Array<T> list = JSCollections.$array();

    while (size > 0)
    {
      list.push(JSObjectAdapter.$js("new clazz()"));
      size--;
    }

    return list;
  }

  /**
   * 
   * @param array
   * @param callback
   * @param doneCb
   */
  @Async
  public static <T> void forEachArrayValueAsync(Array<T> array,
      @AsyncCallback Callback3<Integer, T, Callback0> callback, @AsyncCallback Callback0 doneCb)
  {
    if (callback == null)
    {
      JsUtil.throwError("MissingParameter: callback");
    }

    if (array.$length() == 0)
    {
      doneCb.$invoke();
      return;
    }

    WorkflowData data = new WorkflowData();
    data.completed = 0;

    /**
     * Evaluates the current (completed acts as pointer) function in the
     * function list
     */
    Callback1<Callback0> iterate = (nextCallback) ->
    {
      callback.$invoke(data.completed, array.$get(data.completed), nextCallback);
    };

    data.mainCb = () ->
    {
      data.completed++;
      if (data.completed == array.$length())
      {
        doneCb.$invoke();
      }
      else
      {
        iterate.$invoke(data.mainCb);
      }
    };

    iterate.$invoke(data.mainCb);
  }

  /**
   * 
   * @param array
   * @param callback
   */
  public static <T> void forEachArrayValue(Array<T> array, Callback2<Integer, T> callback)
  {
    for (int i = 0; i < array.$length(); i++)
    {
      callback.$invoke(i, array.$get(i));
    }
  }
}
