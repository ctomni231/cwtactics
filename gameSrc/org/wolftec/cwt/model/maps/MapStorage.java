package org.wolftec.cwt.model.maps;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.FolderStorage;

public class MapStorage {

  private final FolderStorage mapDir;

  public MapStorage() {
    mapDir = new FolderStorage("maps/");
  }

  @AsyncOperation
  public void fetchStoredMapNames(@AsyncCallback Callback1<Array<String>> onFinish) {
    mapDir.fileList((names) -> {
      onFinish.$invoke(names);
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public void loadMap(String mapName, @AsyncCallback Callback1<Object> onFinish) {
    mapDir.readFile(mapName, (mapData) -> {
      // FIXME
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  public void writeMap(String mapName, MapData map, @AsyncCallback Callback0 onFinish) {
    mapDir.writeFile(mapName, map, onFinish, JsUtil.throwErrorCallback());
  }
}
