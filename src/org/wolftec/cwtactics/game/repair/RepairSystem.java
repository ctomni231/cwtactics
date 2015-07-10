package org.wolftec.cwtactics.game.repair;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.LoadUnitType;

public class RepairSystem implements System, LoadUnitType {

  private Asserter             asserter;

  private Components<Repairer> repairers;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (repairers.isComponentInRootData(data)) {
      Repairer repairer = repairers.acquireWithRootData(entity, data);
      asserter.inspectValue("Repairer.amount of " + entity, repairer.amount).isIntWithinRange(1, Constants.UNIT_HEALTH);
      asserter.inspectValue("Repairer.targets of " + entity, repairer.targets).forEachArrayValue((target) -> {
        asserter.isEntityId();
      });
    }
  }
}
