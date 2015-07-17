package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class TransportAbility implements Component {
  public int           slots;
  public Array<String> loads;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("slots")
        .integer()
        .ge(1)
        .le(3); // slotA, slotB, slotC

    data.desc("loads")
        .list()
        .values((valData) -> valData.componentEntity(MovingAbility.class));
  }
}
