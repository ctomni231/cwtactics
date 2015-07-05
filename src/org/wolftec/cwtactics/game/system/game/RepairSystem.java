package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Repairer;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.persistence.LoadUnitType;

public class RepairSystem implements System, LoadUnitType {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Repairer.class, (repairer) -> {
      asserter.inspectValue("Repairer.amount of " + entity, repairer.amount).isIntWithinRange(1, Constants.UNIT_HEALTH);
      asserter.inspectValue("Repairer.targets of " + entity, repairer.targets).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    });
  }
}
