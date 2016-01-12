package org.wolftec.cwt.ui;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.managed.ManagedClass;

public class UiDataMapConfiguration implements ManagedClass
{

  @STJSBridge
  public static class UiDataPlayerConfig
  {
    public String name;
    public int    team;
  }

  public String                    selectedMap;
  public Array<UiDataPlayerConfig> players;
  public int                       turnLimit;
}
