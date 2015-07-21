package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Stealth implements Component {
  public boolean hidden;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("hidden").bool();
  }
}
