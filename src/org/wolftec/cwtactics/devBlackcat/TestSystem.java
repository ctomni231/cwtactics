package org.wolftec.cwtactics.devBlackcat;

import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.GameroundEvents;

public class TestSystem implements ConstructedClass, GameroundEvents {

  private Log log;

  @Override
  public void onGameroundStarts() {
    log.info("--------------- implemented ---------------");
  }
}
