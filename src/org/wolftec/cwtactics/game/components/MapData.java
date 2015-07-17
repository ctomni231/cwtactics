package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class MapData implements Component {

  public String mapName;
  public int    width;
  public int    height;
  public int    players;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("mapName")
        .pattern("[a-zA-Z0-9]{4,10}");

    data.desc("width")
        .integer()
        .ge(15)
        .le(50);

    data.desc("height")
        .integer()
        .ge(15)
        .le(50);

    data.desc("players")
        .integer()
        .ge(2)
        .le(4);
  }
}
