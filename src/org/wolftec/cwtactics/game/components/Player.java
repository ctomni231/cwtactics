package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Player implements Component {

  public String  name;
  public int     gold;
  public boolean alive;
  public int     team;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("name")
        .pattern("[a-zA-Z0-9]{4,10}");

    data.desc("gold")
        .integer()
        .ge(0)
        .le(1000000);

    data.desc("alive")
        .bool();

    data.desc("team")
        .integer()
        .ge(0)
        .le(3);
  }
}
