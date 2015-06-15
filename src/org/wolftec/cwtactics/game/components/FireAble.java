package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class FireAble implements IEntityComponent {
  public Array<String> usableBy;
  public int damage;
  public int range;
  public String changesType;
}
