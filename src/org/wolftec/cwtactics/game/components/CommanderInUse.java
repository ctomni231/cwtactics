package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class CommanderInUse implements Component {

  public static final int NO_POWER    = 0;
  public static final int POWER       = 1;
  public static final int SUPER_POWER = 2;
  public static final int TAG_POWER   = 3;

  public int              power;
  public int              activeLevel;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("power").integer().ge(0).le(100000);
    data.desc("activeLevel").oneOf(NO_POWER, POWER, SUPER_POWER, TAG_POWER);
  }
}
