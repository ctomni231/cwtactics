package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.IEntityComponent;

public class Capturable implements IEntityComponent {
  public int points;
  public boolean looseAfterCaptured;
  public String changeIntoAfterCaptured;
}
