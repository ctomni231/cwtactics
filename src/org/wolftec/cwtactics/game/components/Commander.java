package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Commander implements Component {

  public String army;
  public int    powerStars;
  public int    superPowerStars;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("army")
        .componentEntity(Army.class);
    data.desc("powerStars")
        .integer()
        .ge(1)
        .le(5);
    data.desc("superPowerStars")
        .integer()
        .ge(1)
        .le(5);
  }
}
