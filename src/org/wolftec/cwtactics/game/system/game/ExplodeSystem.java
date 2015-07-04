package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.ExplodeAbility;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.LoadEntityEvent;
import org.wolftec.cwtactics.game.event.game.ExplodeEvents;

public class ExplodeSystem implements System, LoadEntityEvent, ExplodeEvents {

  private EntityManager em;
  private Asserter as;

  @Override
  public void onExplodeSelf(String unit) {

  }

  @Override
  public void onLoadUnitTypeEntity(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, ExplodeAbility.class, (suicide) -> {
      as.inspectValue("Suicide.damage of " + entity, suicide.damage).isIntWithinRange(1, Constants.UNIT_HEALTH);
      as.inspectValue("Suicide.range of " + entity, suicide.range).isIntWithinRange(1, Constants.MAX_SELECTION_RANGE);
      as.inspectValue("Suicide.noDamage of " + entity, suicide.noDamage).forEachArrayValue((target) -> {
        as.isEntityId();
      });
    });
  }
}
