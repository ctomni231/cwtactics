package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class StealthAbility implements Component {
  public int additionFuelDrain;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("additionFuelDrain").integer().def(0).ge(0).le(100);
  }
}
