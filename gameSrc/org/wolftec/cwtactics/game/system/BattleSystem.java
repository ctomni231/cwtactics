package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.FighterPrimaryWeapon;
import org.wolftec.cwtactics.game.components.FighterSecondaryWeapon;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.RangedFighter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;

/**
 * The {@link BattleSystem} allows players to use units with the battle ability
 * to fight against other entities with the living ability.
 */
public class BattleSystem implements ConstructedClass, UnitCreatedEvent, LoadEntityEvent {

  private Log log;
  private EntityManager em;

  @Override
  public void onUnitCreated(String unitEntity) {
    em.getNonNullComponent(unitEntity, Living.class).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    if (entityType == LoadEntityEvent.TYPE_UNIT_DATA) {
      em.tryAcquireComponentFromData(entity, data, FighterPrimaryWeapon.class);
      em.tryAcquireComponentFromData(entity, data, FighterSecondaryWeapon.class);
      em.tryAcquireComponentFromData(entity, data, RangedFighter.class);

      if (em.hasEntityComponent(entity, RangedFighter.class) && !em.hasEntityComponent(entity, FighterPrimaryWeapon.class)) {
        log.error(entity + " uses " + ClassUtil.getClassName(RangedFighter.class) + " without having " + ClassUtil.getClassName(FighterPrimaryWeapon.class));
      }
    }
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
