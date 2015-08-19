package org.wolftec.cwt.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge
public class MapData {

  public String                name;
  public Array<String>         typeMap;
  public Array<Array<Integer>> map;
  public int                   mph;
  public int                   mpw;
  public int                   player;
  public Array<Array<Object>>  units;
  public Array<Array<Object>>  prps;
}
