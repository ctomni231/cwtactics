package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.game.core.IEntityComponent;

public class TimerData implements IEntityComponent {

  public int turnTime;
  public int gameTime;

  public int turnTimeLimit;
  public int gameTimeLimit;
}
