package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class MovingSupplies implements Component {
  public int fuel;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("fuel")
        .integer()
        .ge(0)
        .le(100);
  }
}
