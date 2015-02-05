package net.wolfTec.wtEngine.model;

import net.wolfTec.wtEngine.assets.AssetItem;
import net.wolfTec.wtEngine.assets.AssetLoader;
import net.wolfTec.wtEngine.assets.AssetType;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.persistence.StorageBean;
import net.wolfTec.wtEngine.persistence.StorageEntry;
import net.wolfTec.wtEngine.utility.BrowserHelperBean;
import net.wolfTec.wtEngine.utility.ExternalRequestOptions;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public class MapManagerBean implements AssetLoader {
  
  public static final String MAP_PREFIX = "MAP_";

  private Logger log;
  private StorageBean storage;
  private BrowserHelperBean browserUtil;
  
  public void getMapList(Callback1<Array<String>> callback) {
    storage.keys((keys) -> {
      Array<String> maps = JSCollections.$array();
      for (int i = 0; i < keys.$length(); i++) {
        String map = keys.$get(i);
        if (map.startsWith(MAP_PREFIX)) {
          maps.push(map.substring(MAP_PREFIX.length()));
        }
      }
      
      callback.$invoke(maps);
    });
  }
  
  public void loadMap(String mapId, Callback1<StorageEntry<MapFile>> callback) {
    storage.get(MAP_PREFIX + mapId, callback);
  }

  @Override public void cacheAsset(AssetItem item, Object data, Callback0 callback) {
    storage.set(MAP_PREFIX+item.path, data, (error, savedData) -> {
      callback.$invoke();
    });
  }

  @Override public void loadAsset(AssetItem item, Object data, Callback0 callback) {
    // maps will be loaded when needed
  }

  @Override public void grabAsset(AssetItem item, Callback1<Object> callback) {
    if (item.type == AssetType.MAPS) {
      ExternalRequestOptions requestOptions = new ExternalRequestOptions();
      
      requestOptions.json = true;
      requestOptions.path = item.path;
      requestOptions.success = callback;
      requestOptions.error = (msg) -> {
        log.error(msg.toString());
      };
      
      browserUtil.doHttpRequest(requestOptions);
    }
  }
}
