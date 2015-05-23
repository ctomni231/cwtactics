package org.wolftec.cwtactics.engine.converter;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;

public interface DataConverter<T> {

  public void grabData(AssetEntry asset, Callback1<T> callback);

  public void cacheData(T data, Callback1<String> callback);

  public void loadData(String data, Callback1<T> callback);
}
