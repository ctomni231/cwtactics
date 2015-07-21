package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Manpower implements Component {
  public int amount;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("amount").integer().ge(0).le(1000000);
  }
}
