package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
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
        em.tryAcquireComponentFromDataSuccessCb(entity, data, FireAble.class, (suicide) -> {
          asserter.inspectValue("FireAble.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
          asserter.inspectValue("FireAble.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
          asserter.inspectValue("FireAble.changesType of " + entity, suicide.changesType).whenNotNull(() -> {
            asserter.isEntityId();
          });
        });
        break;
    }
  }
}
