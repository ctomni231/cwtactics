package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.Owner;
import org.wolftec.cwtactics.game.components.Position;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

// TODO remove this class
public class ModelCreationSystem implements ISystem, SystemStartEvent {

  private EntityManager em;

  @Override
  public void onSystemStart() {

    for (int i = 0; i < 4; i++) {
      em.acquireEntityWithId("P" + i);
    }

    for (int i = 0; i < 4 * 50; i++) {
      em.acquireEntityWithId("U" + i);
      em.acquireEntityComponent("U" + i, Owner.class);
    }

    for (int i = 0; i < 200; i++) {
      em.acquireEntityWithId("PR" + i);
      em.acquireEntityComponent("PR" + i, Position.class);
      em.acquireEntityComponent("PR" + i, Owner.class);
    }
  }
}
