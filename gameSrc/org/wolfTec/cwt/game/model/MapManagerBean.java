package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.types.MapFileType;
import org.wolfTec.wolfTecEngine.assets.AssetItem;
import org.wolfTec.wolfTecEngine.assets.GameDataGrabber;
import org.wolfTec.wolfTecEngine.assets.AssetType;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;
import org.wolfTec.wolfTecEngine.beans.InjectedByFactory;
import org.wolfTec.wolfTecEngine.log.Logger;
import org.wolfTec.wolfTecEngine.persistence.VirtualFilesystem;
import org.wolfTec.wolfTecEngine.persistence.FileDescriptor;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolfTec.wolfTecEngine.util.XmlHttpReqOptions;

@Bean
public class MapManagerBean implements GameDataGrabber {

  @InjectedByFactory
  private Logger log;
  @Injected
  private VirtualFilesystem storage;
  @Injected
  private BrowserUtil browserUtil;

  public void getMapList(Callback1<Array<String>> callback) {
    storage.readFileList((keys) -> {
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

  public void loadMap(String mapId, Callback1<FileDescriptor<MapFileType>> callback) {
    storage.readFile(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX + mapId, callback);
  }

//  @Override
//  public void grabAsset(AssetItem item, Callback0 callback) {
//    if (item.type == AssetType.MAPS) {
//      XmlHttpReqOptions requestOptions = new XmlHttpReqOptions();
//
//      requestOptions.json = true;
//      requestOptions.path = item.path;
//      requestOptions.success = (data) -> {
//        storage.writeFile(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX + item.path, data,
//            (result, error) -> {
//              if (error != null) {
//                log.error("Could not store map");
//              } else {
//                callback.$invoke();
//              }
//            });
//      };
//      requestOptions.error = (msg) -> {
//        log.error(msg.toString());
//      };
//
//      browserUtil.doHttpRequest(requestOptions);
//    }
//  }

  @Override
  public void loadAsset(AssetItem item, Callback0 callback) {
    // TODO Auto-generated method stub

  }
}
