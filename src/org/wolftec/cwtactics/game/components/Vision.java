package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Vision implements Component {
  public int range;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("range").integer().ge(1).le(10);
  }
}
