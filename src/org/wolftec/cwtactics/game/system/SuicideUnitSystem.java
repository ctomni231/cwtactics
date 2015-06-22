package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.ExplodeAbility;
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
        em.tryAcquireComponentFromDataSuccessCb(entity, data, ExplodeAbility.class, (suicide) -> {
          asserter.inspectValue("Suicide.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
          asserter.inspectValue("Suicide.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
          asserter.inspectValue("Suicide.noDamage of " + entity, suicide.noDamage).forEachArrayValue((target) -> {
            asserter.isEntityId();
          });
        });
        break;
    }
  }
}
