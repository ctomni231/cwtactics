package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.ClassUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Defense;
import org.wolftec.cwtactics.game.components.FighterPrimaryWeapon;
import org.wolftec.cwtactics.game.components.FighterSecondaryWeapon;
import org.wolftec.cwtactics.game.components.Living;
import org.wolftec.cwtactics.game.components.RangedFighter;
import org.wolftec.cwtactics.game.core.Asserter;
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
  private Asserter asserter;

  @Override
  public void onUnitCreated(String unitEntity) {
    em.getNonNullComponent(unitEntity, Living.class).hp = Constants.UNIT_HEALTH;
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {

      case TYPE_UNIT_DATA:
        FighterPrimaryWeapon primWp = em.tryAcquireComponentFromData(entity, data, FighterPrimaryWeapon.class);
        if (primWp != null) {
          asserter.assertTrue("minrange int", Is.is.integer(primWp.ammo));
          asserter.assertTrue("minrange >= 0", Is.is.above(primWp.ammo, 0));
          asserter.assertTrue("maxrange < 10", Is.is.under(primWp.ammo, 10));
        }

        FighterSecondaryWeapon secWp = em.tryAcquireComponentFromData(entity, data, FighterSecondaryWeapon.class);

        RangedFighter rangFig = em.tryAcquireComponentFromData(entity, data, RangedFighter.class);
        if (rangFig != null) {
          asserter.assertTrue("minrange int", Is.is.integer(rangFig.minRange));
          asserter.assertTrue("minrange > 0", Is.is.above(rangFig.minRange, 0));
          asserter.assertTrue("maxrange int", Is.is.integer(rangFig.maxRange));
          asserter.assertTrue("maxrange > minrange", Is.is.above(rangFig.maxRange, rangFig.minRange));
          asserter.assertTrue("maxrange < " + Constants.MAX_SELECTION_RANGE, Is.is.under(rangFig.maxRange, Constants.MAX_SELECTION_RANGE));

          if (primWp == null) {
            log.error(entity + " uses " + ClassUtil.getClassName(RangedFighter.class) + " without having " + ClassUtil.getClassName(FighterPrimaryWeapon.class));
          }
        }

        break;

      case TYPE_PROPERTY_DATA:
      case TYPE_TILE_DATA:
        Defense defense = em.tryAcquireComponentFromData(entity, data, Defense.class);
        if (defense != null) {
          asserter.assertTrue("minrange integer", Is.is.integer(defense.defense));
          asserter.assertTrue("minrange greater equals 1", Is.is.above(defense.defense, -1));
        }
        break;
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
