package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Suicide;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class SuicideUnitSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        Suicide suicide = em.tryAcquireComponentFromData(entity, data, Suicide.class);
        if (suicide != null) {
          asserter.assertTrue("suicide.damage int", Is.is.integer(suicide.damage));
          asserter.assertTrue("suicide.damage > 0", Is.is.above(suicide.damage, 0));
          asserter.assertTrue("suicide.damage < UNIT_HEALTH", Is.is.under(suicide.damage, Constants.UNIT_HEALTH + 1));

          asserter.assertTrue("suicide.range int", Is.is.integer(suicide.range));
          asserter.assertTrue("suicide.range > 0", Is.is.above(suicide.range, 0));
          asserter.assertTrue("suicide.range <= MAX_SELECTION_RANGE", Is.is.under(suicide.range, Constants.MAX_SELECTION_RANGE + 1));

          asserter.assertTrue("suicide.noDamage array", Is.is.array(suicide.noDamage));
          JsUtil.forEachArrayValue(suicide.noDamage, (index, entry) -> {
            asserter.assertTrue("suicide.noDamage(v) str", Is.is.string(entry));
            asserter.assertTrue("suicide.noDamage(v) entity", em.isEntity(entry));
          });
        }
        break;
    }
  }
}
