package org.wolftec.cwtactics.engine.converter;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.playground.Playground.AssetEntry;
import org.wolftec.cwtactics.engine.util.BrowserUtil;

public class ObjectConverter implements DataConverter<Map<String, Object>> {

  @Override
  public void grabData(AssetEntry asset, Callback1<Map<String, Object>> callback) {
    BrowserUtil.requestJsonFile(asset.url, (data, error) -> {
      if (error == null) {
        callback.$invoke(data); // TODO error
      }
    });
  }

  @Override
  public void cacheData(Map<String, Object> data, Callback1<String> callback) {
    callback.$invoke(JSGlobal.JSON.stringify(data));
  }

  @Override
  public void loadData(String data, Callback1<Map<String, Object>> callback) {
    callback.$invoke((Map<String, Object>) JSGlobal.JSON.parse(data));
  }

}
