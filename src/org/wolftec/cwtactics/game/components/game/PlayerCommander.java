package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.game.core.Component;

public class PlayerCommander implements Component {

  public enum PowerLevel {
    NONE, POWER, SUPER_POWER
  }

  public int power;
  public PowerLevel activeLevel;
}
