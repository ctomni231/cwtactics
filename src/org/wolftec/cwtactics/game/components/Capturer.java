package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Capturer implements Component {
  public int points;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("points").integer().def(10).ge(1).le(100);
  }
}
