package org.wolftec.cwtactics.engine.converter;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.BrowserUtil;

public class TypedObjectConverter<T> implements DataConverter<T> {

  @Override
  public void grabData(AssetEntry asset, Callback1<T> callback) {
    BrowserUtil.doXmlHttpRequest(asset.url, null, (objData, error) -> {

    });
  }

  @Override
  public void cacheData(T data, Callback1<String> callback) {
    callback.$invoke(JSGlobal.JSON.stringify(data));
  }

  @Override
  public void loadData(String data, Callback1<T> callback) {
    // callback.$invoke();
  }

}
