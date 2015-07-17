package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Defense implements Component {
  public int defense;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("defense")
        .integer()
        .ge(0)
        .le(10);
  }
}
