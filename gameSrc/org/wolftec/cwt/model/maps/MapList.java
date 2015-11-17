package org.wolftec.cwt.model.maps;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.collection.ListUtil;

/**
 * This class is a presentation of the known maps in the game storage. This
 * class only contains the map names. It's understandable as a lazy concept to
 * know all maps without having them completely in RAM.
 */
public class MapList {

  private Array<String> maps;

  public void initByList(Array<String> names) {
    maps = JSCollections.$array();
    ListUtil.forEachArrayValue(names, (i, e) -> maps.push(e));
  }

  public int getNumberOfMaps() {
    return maps.$length();
  }

  public void forEachMap(Callback1<String> it) {
    ListUtil.forEachArrayValue(maps, (i, e) -> it.$invoke(e));
  }
}
