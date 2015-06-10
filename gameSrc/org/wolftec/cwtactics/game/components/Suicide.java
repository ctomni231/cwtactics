package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class Suicide implements IEntityComponent {
  public int damage;
  public int range;
  public Array<String> noDamage;
}
