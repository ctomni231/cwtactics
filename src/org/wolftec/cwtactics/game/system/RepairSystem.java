package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Repairer;
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
  public void onLoadUnitTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Repairer.class, (repairer) -> {
      asserter.inspectValue("Repairer.amount of " + entity, repairer.amount).isIntWithinRange(1, Constants.UNIT_HEALTH);
      asserter.inspectValue("Repairer.targets of " + entity, repairer.targets).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    });
  }
}
