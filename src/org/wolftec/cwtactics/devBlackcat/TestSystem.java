package org.wolftec.cwtactics.devBlackcat;

import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.gameround.GameroundStart;

public class TestSystem implements System, GameroundStart {

  private Log log;

  @Override
  public void gameroundStart() {
    log.info("--------------- implemented ---------------");
  }
}
