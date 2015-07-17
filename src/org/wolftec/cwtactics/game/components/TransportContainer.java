package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class TransportContainer implements Component {

  public String slotA;
  public String slotB;
  public String slotC;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("slotA")
        .isString();

    data.desc("slotB")
        .isString();

    data.desc("slotC")
        .isString();
  }
}
