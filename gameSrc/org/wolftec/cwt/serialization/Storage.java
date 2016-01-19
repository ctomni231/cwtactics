package org.wolftec.cwt.serialization;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public interface Storage
{

  public <T> void loadEntry(String key, Callback1<T> callback, Callback1<String> onError);

  public void saveEntry(String key, Object value, Callback0 callback, Callback1<String> onError);

  public void removeEntry(String key, Callback0 callback, Callback1<String> onError);

  public void clearEntries(Callback0 callback, Callback1<String> onError);

  public void getKeys(Callback1<Array<String>> callback, Callback1<String> onError);

}
