package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.types.MapFileType;
import org.wolfTec.wolfTecEngine.assets.AssetItem;
import org.wolfTec.wolfTecEngine.assets.AssetLoader;
import org.wolfTec.wolfTecEngine.assets.AssetType;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.InjectedByFactory;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.persistence.StorageBean;
import org.wolfTec.wolfTecEngine.persistence.StorageEntry;
import org.wolfTec.wolfTecEngine.util.BrowserHelperBean;
import org.wolfTec.wolfTecEngine.util.ExternalRequestOptions;

@Bean
public class MapManagerBean implements AssetLoader {

  @InjectedByFactory
  private Logger log;
  @Injected
  private StorageBean storage;
  @Injected
  private BrowserHelperBean browserUtil;

  public void getMapList(Callback1<Array<String>> callback) {
    storage.keys((keys) -> {
      Array<String> maps = JSCollections.$array();
      for (int i = 0; i < keys.$length(); i++) {
        String map = keys.$get(i);
        if (map.startsWith(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX)) {
          maps.push(map.substring(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX.length()));
        }
      }

      callback.$invoke(maps);
    });
  }

  public void loadMap(String mapId, Callback1<StorageEntry<MapFileType>> callback) {
    storage.get(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX + mapId, callback);
  }

  @Override
  public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MAPS) {
      ExternalRequestOptions requestOptions = new ExternalRequestOptions();

      requestOptions.json = true;
      requestOptions.path = item.path;
      requestOptions.success = (data) -> {
        storage.set(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX + item.path, data,
            (result, error) -> {
              if (error != null) {
                log.error("Could not store map");
              } else {
                callback.$invoke();
              }
            });
      };
      requestOptions.error = (msg) -> {
        log.error(msg.toString());
      };

      browserUtil.doHttpRequest(requestOptions);
    }
  }

  @Override
  public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    // TODO Auto-generated method stub

  }
}
