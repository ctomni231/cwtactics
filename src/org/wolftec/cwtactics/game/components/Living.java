package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Living implements Component {
  public int hp;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("hp")
        .integer()
        .ge(0)
        .le(99);
  }
}
