package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.model.types.MapFileType;
import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.beans.annotations.Created;
import org.wolfTec.wolfTecEngine.logging.model.Logger;
import org.wolfTec.wolfTecEngine.persistence.model.FileDescriptor;
import org.wolfTec.wolfTecEngine.persistence.model.VirtualFilesystemFolder;

@Bean
public class MapManagerBean {

  @Created("{name=$beanName}")
  private Logger log;
  
  @Created("{folder=/maps, converter=MapFileConverter}")
  private VirtualFilesystemFolder fs;

  public void getMapList(Callback1<Array<String>> callback) {
    fs.readFileList((keys) -> {
      callback.$invoke(keys);
    });
  }

  public void loadMap(String mapId, Callback1<FileDescriptor<MapFileType>> callback) {
    fs.readFile(mapId, callback);
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
}
