package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Owner implements Component {
  public String owner;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("owner").componentEntity(Player.class);
  }
}
