package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.FireAble;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class SpecialWeaponsSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_PROPERTY_DATA:
        FireAble fireAble = em.tryAcquireComponentFromData(entity, data, FireAble.class);
        if (fireAble != null) {
          asserter.assertTrue("fireAble.damage int", Is.is.integer(fireAble.damage));
          asserter.assertTrue("fireAble.damage > 0", Is.is.above(fireAble.damage, 0));
          asserter.assertTrue("fireAble.damage < UNIT_HEALTH", Is.is.under(fireAble.damage, Constants.UNIT_HEALTH + 1));

          asserter.assertTrue("fireAble.range int", Is.is.integer(fireAble.range));
          asserter.assertTrue("fireAble.range > 0", Is.is.above(fireAble.range, 0));
          asserter.assertTrue("fireAble.range < MAX_SELECTION_RANGE", Is.is.under(fireAble.range, Constants.MAX_SELECTION_RANGE + 1));

          asserter.assertTrue("fireAble.changesType str or null", fireAble.changesType == null || Is.is.string(fireAble.changesType));
          if (fireAble.changesType != null) asserter.assertTrue("fireAble.changesType entity", em.isEntity(fireAble.changesType));
        }
        break;
    }
  }
}
