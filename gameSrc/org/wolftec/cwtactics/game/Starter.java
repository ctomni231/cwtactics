package org.wolftec.cwtactics.game;

import org.wolftec.cwtactics.game.core.ConstructedFactory;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

/**
 * Starter class with main function.
 */
public class Starter {
  public static void main(String[] args) {
    ConstructedFactory.initObjects();
    ConstructedFactory.getObject(EventEmitter.class).publish(SystemStartEvent.class).onSystemInitialized();
  }
}
