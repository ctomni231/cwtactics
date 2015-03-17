package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.log.Logger;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class MapManagerBean {

  @ManagedConstruction
  private Logger log;

  @Injected
  private MapFileTypeConverter converter;

  @Injected
  private VirtualFilesystemManager fs;

  public void getMapList(Callback1<Array<String>> callback) {
    fs.keyList("maps/[A-Za-z0-9]+\\.map", (keys) -> {
      callback.$invoke(keys);
    });
  }

  public void loadMap(String mapId, Callback1<MapFileType> callback) {
    fs.readKey(mapId, converter, (err, data) -> {
      if (err != null) {
        JsUtil.raiseError("CannotReadMap");
        callback.$invoke(null);
      } else {

        callback.$invoke(data.value);
      }
    });
  }

  // @Override
  // public void grabAsset(AssetItem item, Callback0 callback) {
  // if (item.type == AssetType.MAPS) {
  // XmlHttpReqOptions requestOptions = new XmlHttpReqOptions();
  //
  // requestOptions.json = true;
  // requestOptions.path = item.path;
  // requestOptions.success = (data) -> {
  // storage.writeFile(EngineGlobals.STORAGE_PARAMETER_MAP_PREFIX + item.path,
  // data,
  // (result, error) -> {
  // if (error != null) {
  // log.error("Could not store map");
  // } else {
  // callback.$invoke();
  // }
  // });
  // };
  // requestOptions.error = (msg) -> {
  // log.error(msg.toString());
  // };
  //
  // browserUtil.doHttpRequest(requestOptions);
  // }
  // }
}
