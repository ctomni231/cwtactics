package org.wolftec.cwt.model.maps;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType
public class MapData {

  public String name;
  public int mph;
  public int mpw;
  public int player;
  public Array<String> typeMap;
  public Array<Array<Integer>> map;
  public Array<Array<Object>> units;
  public Array<Array<Object>> prps;
}
