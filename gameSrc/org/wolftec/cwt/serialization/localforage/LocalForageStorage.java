package org.wolftec.cwt.serialization.localforage;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.serialization.Storage;
import org.wolftec.cwt.util.NullUtil;

public class LocalForageStorage implements Storage
{

  @Override
  public <T> void loadEntry(String key, Callback1<T> callback, Callback1<String> onError)
  {
    LocalForage.localforage.getItem(key, (err, value) ->
    {
      if (NullUtil.isPresent(err) || !NullUtil.isPresent(value))
      {
        onError.$invoke(NullUtil.getOrElse(err, "NotDefined: " + key));
      }
      else
      {
        callback.$invoke((T) value);
      }
    });
  }

  @Override
  public void saveEntry(String key, Object value, Callback0 callback, Callback1<String> onError)
  {
    LocalForage.localforage.setItem(key, value, (err, savedValue) ->
    {
      if (NullUtil.isPresent(err))
      {
        onError.$invoke(err);
      }
      else
      {
        callback.$invoke();
      }
    });
  }

  @Override
  public void removeEntry(String key, Callback0 callback, Callback1<String> onError)
  {
    LocalForage.localforage.removeItem(key, (err) ->
    {
      if (NullUtil.isPresent(err))
      {
        onError.$invoke(err);
      }
      else
      {
        callback.$invoke();
      }
    });
  }

  @Override
  public void clearEntries(Callback0 callback, Callback1<String> onError)
  {
    LocalForage.localforage.clear((err) ->
    {
      if (NullUtil.isPresent(err))
      {
        onError.$invoke(err);
      }
      else
      {
        callback.$invoke();
      }
    });
  }

  @Override
  public void getKeys(Callback1<Array<String>> callback, Callback1<String> onError)
  {
    LocalForage.localforage.keys((err, keys) ->
    {
      if (NullUtil.isPresent(err))
      {
        onError.$invoke(err);
      }
      else
      {
        callback.$invoke(keys);
      }
    });
  }

}
