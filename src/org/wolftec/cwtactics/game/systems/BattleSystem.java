package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwt.Constants;
import org.wolftec.cwtactics.game.components.BattleAbility;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.UnitCreated;
import org.wolftec.cwtactics.game.events.gameround.UnitDestroyed;

/**
 * The {@link BattleSystem} allows players to use units with the battle ability
 * to fight against other entities with the living ability.
 */
public class BattleSystem implements System, UnitCreated, UnitDestroyed {

  private Components<Living>        livings;
  private Components<BattleAbility> fighters;

  @Override
  public void onUnitCreated(String unitEntity) {
    livings.acquire(unitEntity).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onUnitDestroyed(String unitEntity) {
    livings.release(unitEntity);
  }

  private boolean isDirectFighter(String entity) {
    BattleAbility fighter = fighters.get(entity);
    return fighter.minRange == 1 && fighter.maxRange == 1;
  }

  private boolean isIndirectFighter(String entity) {
    BattleAbility fighter = fighters.get(entity);
    return fighter.minRange == 1 && fighter.maxRange == 1;
  }

  private boolean isBallisticFither(String entity) {
    BattleAbility fighter = fighters.get(entity);
    return fighter.minRange == 1 && fighter.maxRange > 1;
  }
}
