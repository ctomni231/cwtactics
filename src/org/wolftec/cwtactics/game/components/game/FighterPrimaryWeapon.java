package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.IEntityComponent;

public class FighterPrimaryWeapon implements IEntityComponent {
  public int ammo;
  public Map<String, Integer> damage;
}
