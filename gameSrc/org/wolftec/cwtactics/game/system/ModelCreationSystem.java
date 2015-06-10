package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

// TODO remove this class
public class ModelCreationSystem implements ConstructedClass, SystemStartEvent {

  private EntityManager em;

  @Override
  public void onSystemStartup(Playground gameContainer) {
    em.acquireEntityWithId("*");

    // for (int i = 0; i < 4; i++) {
    // em.acquireEntityWithId("P" + i);
    // }
    //
    // for (int i = 0; i < 4 * 50; i++) {
    // em.acquireEntityWithId("U" + i);
    // em.acquireEntityComponent("U" + i, Owner.class);
    // }
    //
    // for (int i = 0; i < 200; i++) {
    // em.acquireEntityWithId("PR" + i);
    // em.acquireEntityComponent("PR" + i, Position.class);
    // em.acquireEntityComponent("PR" + i, Owner.class);
    // }
  }
}
