package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class MovingAbility implements Component {

  public int range;
  public int fuel;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("range")
        .integer()
        .ge(1)
        .le(10);

    data.desc("fuel")
        .integer()
        .ge(1)
        .le(100);
  }
}
