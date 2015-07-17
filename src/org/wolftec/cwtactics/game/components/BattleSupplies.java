package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class BattleSupplies implements Component {
  public int amount;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("amount")
        .integer()
        .ge(0)
        .le(10);
  }
}
