package org.wolftec.cwt.model.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.loading.DataGrabber;
import org.wolftec.cwt.loading.ResourceGrabbingType;
import org.wolftec.cwt.serialization.FileDescriptor;
import org.wolftec.cwt.serialization.PersistenceManager;
import org.wolftec.cwt.util.JsUtil;

public class MapManager implements DataGrabber
{

  private PersistenceManager pm;

  private Array<FileDescriptor> maps;

  public MapManager()
  {
    maps = JSCollections.$array();
  }

  /**
   * 
   * @param path
   * @param cb
   */
  public void loadMap(String mapName, Callback1<MapData> cb)
  {
    pm.get(getDescriptor(mapName).path, (err, data) ->
    {
      cb.$invoke((MapData) data);
    });
  }

  private FileDescriptor getDescriptor(String mapName)
  {
    for (int i = 0; i < maps.$length(); i++)
    {
      if (maps.$get(i).fileName == mapName)
      {
        return maps.$get(i);
      }
    }
    return JsUtil.throwError("UnknownMap:" + mapName);
  }

  public FileDescriptor getMapName(int id)
  {
    return maps.$get(id);
  }

  public int getNumberOfMaps()
  {
    return maps.$length();
  }

  @Override
  public String getTargetFolder()
  {
    return "maps";
  }

  @Override
  public ResourceGrabbingType getFileType(FileDescriptor file)
  {
    return ResourceGrabbingType.JSON_DATA;
  }

  @Override
  public void putDataIntoGame(FileDescriptor file, Object data)
  {
    maps.push(file.clone());
  }

}
