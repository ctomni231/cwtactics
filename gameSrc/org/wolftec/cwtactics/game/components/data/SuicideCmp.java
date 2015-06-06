package org.wolftec.cwtactics.game.components.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class SuicideCmp implements IEntityComponent {
  public int damage;
  public int range;
  public Array<String> noDamage;
}
