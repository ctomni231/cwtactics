package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class FighterPrimaryWeapon implements Component {
  public int                  ammo;
  public Map<String, Integer> damage;
}
