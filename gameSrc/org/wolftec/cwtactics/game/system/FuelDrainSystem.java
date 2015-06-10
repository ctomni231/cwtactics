package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.FuelDrain;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class FuelDrainSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        FuelDrain drain = em.tryAcquireComponentFromData(entity, data, FuelDrain.class);
        if (drain != null) {
          asserter.assertTrue("drain.daily int", Is.is.integer(drain.daily));
          asserter.assertTrue("drain.daily > 0", Is.is.above(drain.daily, 0));
          asserter.assertTrue("drain.daily < 100", Is.is.under(drain.daily, 100));
        }
        break;
    }
  }
}
