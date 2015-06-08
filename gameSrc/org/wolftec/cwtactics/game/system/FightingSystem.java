package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.HealthComponent;
import org.wolftec.cwtactics.game.components.RangedFightingComponent;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;
import org.wolftec.cwtactics.game.event.UnitDestroyedEvent;

/**
 * The {@link FightingSystem} allows players to use units with the battle
 * ability to fight against other entities with the living ability.
 */
public class FightingSystem implements ISystem, UnitCreatedEvent, UnitDestroyedEvent {

  @Override
  public void onUnitCreated(String unitEntity) {
    em().getNonNullComponent(unitEntity, HealthComponent.class).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onUnitDestroyed(String unitEntity) {
    em().detachEntityComponentByClass(unitEntity, HealthComponent.class);
  }

  private boolean isDirectFighter(String entity) {
    return !isIndirectFighter(entity);
  }

  private boolean isIndirectFighter(String entity) {
    return em().getComponent(entity, RangedFightingComponent.class) != null;
  }

  private boolean isBallisticFither(String entity) {
    RangedFightingComponent range = em().getComponent(entity, RangedFightingComponent.class);
    return range != null && range.minRange == 1;
  }
}
