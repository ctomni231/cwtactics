package org.wolftec.cwtactics.game.domain.managers;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.cwtactics.game.domain.types.MapFileType;
import org.wolftec.log.Logger;
import org.wolftec.persistence.DataTypeConverter;
import org.wolftec.persistence.VirtualFilesystemManager;

@ManagedComponent
public class MapManager implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  private DataTypeConverter<MapFileType> converter;

  @Injected
  private VirtualFilesystemManager fs;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    converter = new DataTypeConverter<MapFileType>(MapFileType.class);
  }

  /**
   * 
   * <p>
   * <strong>This is an I/O operation!</strong>
   * </p>
   * 
   * @param callback
   *          will be called with a list of map paths
   */
  public void getMapList(Callback1<Array<String>> callback) {
    fs.keyList("maps/[A-Za-z0-9]+\\.map", (keys) -> {
      callback.$invoke(keys);
    });
  }

  /**
   * 
   * <p>
   * <strong>This is an I/O operation!</strong>
   * </p>
   * 
   * @param mapId
   *          path of the map that should be loaded
   * @param callback
   *          will be called with the map file as argument
   */
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
}
