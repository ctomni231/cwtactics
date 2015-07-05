package org.wolftec.cwtactics.game.specialWeapons;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.Component;

public class FireAble implements Component {
  public Array<String> usableBy;
  public int damage;
  public int range;
  public String changesType;
}
