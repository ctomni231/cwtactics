package org.wolftec.cwtactics.game.battle;

import org.wolftec.cwtactics.game.ISystem;

/**
 * The {@link FightingSystem} allows players to use units with the battle
 * ability to fight against other entities with the living ability.
 */
public class FightingSystem implements ISystem {

  private boolean isDirectFighter(String entity) {
    return !isIndirectFighter(entity);
  }

  private boolean isIndirectFighter(String entity) {
    return gec(entity, RangedFightingComponent.class) != null;
  }

  private boolean isBallisticFither(String entity) {
    RangedFightingComponent range = gec(entity, RangedFightingComponent.class);
    return range != null && range.minRange == 1;
  }
}
