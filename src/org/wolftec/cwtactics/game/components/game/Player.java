package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.game.IEntityComponent;

public class Player implements IEntityComponent {
  public String name;
  public int gold;
  public boolean alive;
  public int team;
}
