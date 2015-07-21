package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class FuelDrain implements Component {
  public int daily;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("daily").integer().ge(1).le(100);
  }
}
