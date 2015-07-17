package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Turn implements Component {

  public String lastClientOwner;
  public String owner;
  public int    day;

  @Override
  public void describe(DataDescriptor data) {

    data.desc("lastClientOwner")
        .componentEntity(Player.class);

    data.desc("owner")
        .componentEntity(Player.class);

    data.desc("day")
        .integer()
        .ge(0)
        .le(1000000);
  }
}
