package org.wolftec.cwtactics.game.battle;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.IEntityComponent;

public class FightingComponent implements IEntityComponent {
  public int ammo;
  public Map<String, Integer> mainDamage;
  public Map<String, Integer> secondaryDamage;
}
