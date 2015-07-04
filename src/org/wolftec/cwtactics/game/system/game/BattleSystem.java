package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Defense;
import org.wolftec.cwtactics.game.components.game.FighterPrimaryWeapon;
import org.wolftec.cwtactics.game.components.game.FighterSecondaryWeapon;
import org.wolftec.cwtactics.game.components.game.Living;
import org.wolftec.cwtactics.game.components.game.RangedFighter;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.UnitCreatedEvent;

/**
 * The {@link BattleSystem} allows players to use units with the battle ability
 * to fight against other entities with the living ability.
 */
public class BattleSystem implements System, UnitCreatedEvent, LoadEntityEvent {

  private Log log;
  private EntityManager em;
  private Asserter asserter;

  @Override
  public void unitCreatedEvent(String unitEntity) {
    em.getNonNullComponent(unitEntity, Living.class).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onLoadUnitTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, FighterPrimaryWeapon.class, (primWp) -> {
      asserter.inspectValue("FPW.ammo of " + entity, primWp.ammo).isIntWithinRange(0, 10);
    });

    em.tryAcquireComponentFromDataSuccessCb(entity, data, FighterSecondaryWeapon.class, (primWp) -> {
    });

    em.tryAcquireComponentFromDataSuccessCb(entity, data, RangedFighter.class, (rangFig) -> {
      asserter.inspectValue("RF.minRange of " + entity, rangFig.minRange).isIntWithinRange(0, Constants.MAX_SELECTION_RANGE - 1);
      asserter.inspectValue("RF.maxrange of " + entity, rangFig.maxRange).isIntWithinRange(rangFig.minRange + 1, Constants.MAX_SELECTION_RANGE);
      asserter.inspectValue("FPW and RF exists together of " + entity, em.hasEntityComponent(entity, FighterPrimaryWeapon.class)).isTrue();
    });
  }

  @Override
  public void onLoadPropertyTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Defense.class, (defense) -> {
      asserter.inspectValue("DF.defense of " + entity, defense.defense).isIntWithinRange(0, 9);
    });
  }

  @Override
  public void onLoadTileTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Defense.class, (defense) -> {
      asserter.inspectValue("DF.defense of " + entity, defense.defense).isIntWithinRange(0, 9);
    });
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
