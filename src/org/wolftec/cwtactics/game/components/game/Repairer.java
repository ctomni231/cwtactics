package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class Repairer implements IEntityComponent {
  public int amount;
  public Array<String> targets;
}
