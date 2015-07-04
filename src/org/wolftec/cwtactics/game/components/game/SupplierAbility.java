package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.IEntityComponent;

public class SupplierAbility implements IEntityComponent {
  public boolean refillLoads;
  public Array<String> supplies;
}
