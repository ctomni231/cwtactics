package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Usable implements Component {
  public boolean canAct;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("canAct")
        .bool();
  }
}
