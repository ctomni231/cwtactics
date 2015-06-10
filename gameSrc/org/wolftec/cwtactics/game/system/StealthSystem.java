package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.HideAble;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class StealthSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        HideAble hideAble = em.tryAcquireComponentFromData(entity, data, HideAble.class);
        if (hideAble != null) {
          asserter.assertTrue("hideAble.additionFuelDrain int", Is.is.integer(hideAble.additionFuelDrain));
          asserter.assertTrue("hideAble.additionFuelDrain >= 0", Is.is.above(hideAble.additionFuelDrain, -1));
          asserter.assertTrue("hideAble.additionFuelDrain < 100", Is.is.under(hideAble.additionFuelDrain, 100));
        }
        break;
    }
  }
}
