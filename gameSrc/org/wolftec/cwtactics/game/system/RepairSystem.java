package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Repairer;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class RepairSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        Repairer repairer = em.tryAcquireComponentFromData(entity, data, Repairer.class);
        if (repairer != null) {
          asserter.assertTrue("repairer.amount int", Is.is.integer(repairer.amount));
          asserter.assertTrue("repairer.amount > 0", Is.is.above(repairer.amount, 0));
          asserter.assertTrue("repairer.amount < 100", Is.is.under(repairer.amount, Constants.UNIT_HEALTH + 1));

          asserter.assertTrue("repairer.targets array", Is.is.array(repairer.targets));
          JsUtil.forEachArrayValue(repairer.targets, (index, entry) -> {
            asserter.assertTrue("repairer.targets(v) str", Is.is.string(entry));
            asserter.assertTrue("repairer.targets(v) entity", em.isEntity(entry));
          });
        }
        break;
    }
  }
}
