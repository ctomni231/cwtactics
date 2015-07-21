package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Buyable implements Component {

  public int cost;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("cost").integer().ge(1).le(999999);
  }
}
