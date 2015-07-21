package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.components.ExplodeAbility;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.ExplodeSelf;

public class ExplodeSystem implements System, ExplodeSelf {

  private Components<ExplodeAbility> exploders;

  @Override
  public void onExplodeSelf(String unit) {

  }
}
