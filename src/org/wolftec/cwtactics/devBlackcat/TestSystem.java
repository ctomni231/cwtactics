package org.wolftec.cwtactics.devBlackcat;

import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.GameroundEvents;

public class TestSystem implements System, GameroundEvents {

  private Log log;

  @Override
  public void gameroundStartEvent() {
    log.info("--------------- implemented ---------------");
  }
}
