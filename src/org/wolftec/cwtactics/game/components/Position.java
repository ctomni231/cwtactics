package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Position implements Component {
  public int x;
  public int y;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("x").integer().ge(0).lt(50);

    data.desc("y").integer().ge(0).lt(50);
  }
}
