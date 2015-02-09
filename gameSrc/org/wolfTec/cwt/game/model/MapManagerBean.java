package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.assets.AssetItem;
import org.wolfTec.cwt.game.assets.AssetLoader;
import org.wolfTec.cwt.game.assets.AssetType;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.game.utility.ExternalRequestOptions;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.InjectedByFactory;

@Bean public class MapManagerBean implements AssetLoader {

  @InjectedByFactory private Logger log;
  @Injected private StorageBean storage;
  @Injected private BrowserHelperBean browserUtil;
  
  public void getMapList(Callback1<Array<String>> callback) {
    storage.keys((keys) -> {
      Array<String> maps = JSCollections.$array();
      for (int i = 0; i < keys.$length(); i++) {
        String map = keys.$get(i);
        if (map.startsWith(Constants.STORAGE_PARAMETER_MAP_PREFIX)) {
          maps.push(map.substring(Constants.STORAGE_PARAMETER_MAP_PREFIX.length()));
        }
      }
      
      callback.$invoke(maps);
    });
  }
  
  public void loadMap(String mapId, Callback1<StorageEntry<MapFile>> callback) {
    storage.get(Constants.STORAGE_PARAMETER_MAP_PREFIX + mapId, callback);
  }

  @Override public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.MAPS) {
      ExternalRequestOptions requestOptions = new ExternalRequestOptions();
      
      requestOptions.json = true;
      requestOptions.path = item.path;
      requestOptions.success = (data) -> {
        storage.set(Constants.STORAGE_PARAMETER_MAP_PREFIX+item.path, data, (result, error) -> {
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
  
  @Override public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    // TODO Auto-generated method stub
    
  }
}
