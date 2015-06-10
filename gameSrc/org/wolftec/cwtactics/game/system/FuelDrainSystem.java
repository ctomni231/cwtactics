package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.FuelDrain;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class FuelDrainSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromData(entity, data, FuelDrain.class);
        break;
    }
  }
}
