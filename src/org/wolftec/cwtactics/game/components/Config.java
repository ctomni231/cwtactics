package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Config implements Component {
  public int value;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("value")
        .integer();
  }
}
