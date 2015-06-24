package org.wolftec.cwtactics.game.components.game;

import org.wolftec.cwtactics.game.IEntityComponent;

public class Turn implements IEntityComponent {
  public String lastClientOwner;
  public String owner;
  public int day;
}
