package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.Transporter;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;

public class TransportSystem implements ConstructedClass, LoadEntityEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadEntity(String entity, String entityType, Object data) {
    switch (entityType) {
      case LoadEntityEvent.TYPE_UNIT_DATA:
        em.tryAcquireComponentFromDataSuccessCb(entity, data, Transporter.class, (transporter) -> {
          asserter.inspectValue("Transporter.slots of " + entity, transporter.slots).isIntWithinRange(1, 10);
          asserter.inspectValue("Transporter.noDamage of " + entity, transporter.loads).forEachArrayValue((target) -> {
            asserter.isEntityId();
          });
        });
        break;
    }
  }
}
