package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.syscomponent.Component;
import org.wolftec.cwtactics.game.events.gameround.PowerLevel;

public class PlayerCommander implements Component {

  public int        power;
  public PowerLevel activeLevel;
}
