package org.wolftec.cwt.states;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.wTec.ioc.Injectable;

public class UiDataMapConfiguration implements Injectable {

  @STJSBridge
  public static class UiDataPlayerConfig {
    public String name;
    public int    team;
  }

  public String                    selectedMap;
  public Array<UiDataPlayerConfig> players;
  public int                       turnLimit;
}
