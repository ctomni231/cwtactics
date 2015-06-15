package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.IEntityComponent;

public class Supplier implements IEntityComponent {
  public boolean refillLoads;
  public Array<String> supplies;
}
