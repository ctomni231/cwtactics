package org.wolftec.cwtactics.devBlackcat;

import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.DevBlockConstruction;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

public class TestSystem implements ConstructedClass, DevBlockConstruction, SystemStartEvent {

  private Log log;

  @Override
  public void onSystemInitialized() {
    log.warn("It worked yay! :D");
  }
}
