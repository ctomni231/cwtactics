package org.wolftec.cwtactics.game.explode;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.ExplodeSelf;
import org.wolftec.cwtactics.game.event.loading.LoadUnitType;

public class ExplodeSystem implements System, LoadUnitType, ExplodeSelf {

  private Asserter                   as;

  private Components<ExplodeAbility> exploders;

  @Override
  public void onExplodeSelf(String unit) {

  }

  @Override
  public void onLoadUnitType(String entity, Object data) {
    if (exploders.isComponentInRootData(data)) {
      ExplodeAbility suicide = exploders.acquireWithRootData(entity, data);
      as.inspectValue("Suicide.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
      as.inspectValue("Suicide.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
      as.inspectValue("Suicide.noDamage of " + entity, suicide.noDamage).forEachArrayValue((target) -> {
        as.isEntityId();
      });
    }
  }
}
