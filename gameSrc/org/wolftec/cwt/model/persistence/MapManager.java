package org.wolftec.cwt.model.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.loading.DataLoader;
import org.wolftec.cwt.core.persistence.FileDescriptor;
import org.wolftec.cwt.core.persistence.PersistenceManager;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.RequestUtil;

public class MapManager implements DataLoader {

  private PersistenceManager pm;

  private Array<FileDescriptor> maps;

  @Override
  public void onConstruction() {
    maps = JSCollections.$array();
  }

  @Override
  public String forPath() {
    return "maps";
  }

  /**
   * 
   * @param path
   * @param cb
   */
  public void loadMap(String mapName, Callback1<MapData> cb) {
    pm.get(getDescriptor(mapName).path, (err, data) -> {
      cb.$invoke((MapData) data);
    });
  }

  private FileDescriptor getDescriptor(String mapName) {
    for (int i = 0; i < maps.$length(); i++) {
      if (maps.$get(i).fileName == mapName) {
        return maps.$get(i);
      }
    }
    return JsUtil.throwError("UnknownMap:" + mapName);
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb) {
    RequestUtil.getJSON(entryDesc.path, response -> doneCb.$invoke(response.data));
  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    maps.push(entryDesc.clone());
    doneCb.$invoke();
  }

  public FileDescriptor getMapName(int id) {
    return maps.$get(id);
  }

  public int getNumberOfMaps() {
    return maps.$length();
  }

}
