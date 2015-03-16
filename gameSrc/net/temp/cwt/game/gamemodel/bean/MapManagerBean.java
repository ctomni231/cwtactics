package net.temp.cwt.game.gamemodel.bean;

import net.temp.cwt.game.gamemodel.model.MapFileType;
import net.temp.wolfTecEngine.components.CreatedType;
import net.temp.wolfTecEngine.persistence.annotations.FolderPath;
import net.temp.wolfTecEngine.persistence.annotations.UseSerializer;
import net.temp.wolfTecEngine.persistence.model.VirtualFilesystemFolder;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.vfs.VfsEntityDescriptor;
import org.wolftec.core.ManagedComponent;
import org.wolftec.log.Logger;

@ManagedComponent
public class MapManagerBean {

  @CreatedType
  private Logger log;
  
  @CreatedType
  @FolderPath("/maps")
  // @UseSerializer(null) TODO
  private VirtualFilesystemFolder fs;

  public void getMapList(Callback1<Array<String>> callback) {
    fs.readFileList((keys) -> {
      callback.$invoke(keys);
    });
  }

  public void loadMap(String mapId, Callback1<VfsEntityDescriptor<MapFileType>> callback) {
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
