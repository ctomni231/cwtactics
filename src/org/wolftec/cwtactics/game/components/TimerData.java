package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.IEntityComponent;

public class TimerData implements IEntityComponent {

  public int turnTime;
  public int gameTime;

  public int turnTimeLimit;
  public int gameTimeLimit;
}
