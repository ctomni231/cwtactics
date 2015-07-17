package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.Army;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.loading.LoadArmyType;

public class ArmySystem implements System, LoadArmyType {

  private Asserter         asserter;

  private Components<Army> armies;

  @Override
  public void onConstruction() {
  }

  @Override
  public void onLoadArmyType(String entity, Object data) {
    Army army = armies.acquireWithRootData(entity, data);
    asserter.inspectValue("Army.name of " + entity, army.name).isString();
    asserter.inspectValue("Army.music of " + entity, army.music).isString();
    asserter.inspectValue("Army.color of " + entity, army.color).isIntWithinRange(0, 999);
  }
}
