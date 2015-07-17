package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class TimerData implements Component {

  public int turnTime;
  public int gameTime;
  public int turnTimeLimit;
  public int gameTimeLimit;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("turnTime")
        .integer()
        .ge(0)
        .le(3600);

    data.desc("gameTime")
        .integer()
        .ge(0)
        .le(1000000);

    data.desc("turnTimeLimit")
        .integer()
        .ge(0)
        .le(3600);

    data.desc("gameTimeLimit")
        .integer()
        .ge(0)
        .le(1000000);
  }
}
