package org.wolftec.cwtactics.game.system.game;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.Army;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.persistence.LoadArmyType;

public class ArmySystem implements System, LoadArmyType {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadArmyType(String entity, Object data) {
    em.tryAcquireComponentFromDataSuccessCb(entity, data, Army.class, (army) -> {
      asserter.inspectValue("Army.name of " + entity, army.name).isString();
      asserter.inspectValue("Army.music of " + entity, army.music).isString();
      asserter.inspectValue("Army.color of " + entity, army.color).isIntWithinRange(0, 999);
    });
  }
}
