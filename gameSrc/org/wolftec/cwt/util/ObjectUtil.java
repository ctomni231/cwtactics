package org.wolftec.cwt.util;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.annotations.OptionalReturn;

public abstract class ObjectUtil
{

  public static <M> M readProperty(Object data, String property)
  {
    return NullUtil.getOrThrow(getObjectProperty(data, property));
  }

  public static <M> M readPropertyOrDefault(Object data, String property, M defaultValue)
  {
    return NullUtil.getOrElse(getObjectProperty(data, property), defaultValue);
  }

  @OptionalReturn
  public static <T> T getObjectProperty(Object obj, String property)
  {
    return (T) JSObjectAdapter.$get(obj, property);
  }

  public static void setObjectProperty(Object obj, String property, Object value)
  {
    JSObjectAdapter.$put(obj, property, value);
  }

  public static void forEachObjectKeys(Object obj, Callback1<String> callback)
  {
    JsUtil.objectKeys(obj).forEach(callback);
  }

  public static <T> void forEachObjectValueByFilteredKey(Object obj, Function1<String, Boolean> filter,
      Callback2<String, T> callback)
  {
    Array<String> keys = JsUtil.objectKeys(obj);
    for (int i = 0; i < keys.$length(); i++)
    {
      String key = keys.$get(i);
      if (filter == null || filter.$invoke(key) == true)
      {
        callback.$invoke(key, (T) JSObjectAdapter.$get(obj, key));
      }
    }
  }

  public static Map<String, Object> instanceAsMap(Object obj)
  {
    return (Map<String, Object>) obj;
  }

  public static <T> void forEachObjectValue(Object obj, Callback2<String, T> callback)
  {
    forEachObjectValueByFilteredKey(obj, null, callback);
  }

  public static <T> void forEachMapValue(Map<String, T> obj, Callback2<String, T> callback)
  {
    forEachObjectValueByFilteredKey(obj, null, callback);
  }

  public static <T> void forEachMapValueByFilteredKey(Map<String, T> obj, Function1<String, Boolean> filter,
      Callback2<String, T> callback)
  {
    forEachObjectValueByFilteredKey(obj, filter, callback);
  }
}
