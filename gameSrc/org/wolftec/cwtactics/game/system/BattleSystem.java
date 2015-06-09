package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.RangedFighter;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;

/**
 * The {@link BattleSystem} allows players to use units with the battle ability
 * to fight against other entities with the living ability.
 */
public class BattleSystem implements ISystem, UnitCreatedEvent {

  private EntityManager em;

  @Override
  public void onUnitCreated(String unitEntity) {
    em.getNonNullComponent(unitEntity, Living.class).hp = Constants.UNIT_HEALTH;
  }

  private boolean isDirectFighter(String entity) {
    return !isIndirectFighter(entity);
  }

  private boolean isIndirectFighter(String entity) {
    return em.getComponent(entity, RangedFighter.class) != null;
  }

  private boolean isBallisticFither(String entity) {
    RangedFighter range = em.getComponent(entity, RangedFighter.class);
    return range != null && range.minRange == 1;
  }
}
