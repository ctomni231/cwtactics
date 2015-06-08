package org.wolftec.cwtactics.game.system.old;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.PositionComponent;
import org.wolftec.cwtactics.game.components.old.MovingAbilityCmp;

public class MoveSystem implements ISystem {

  public void moveEntity(String id, Array<Integer> path) {
    PositionComponent posC = entityManager().getComponent(id, PositionComponent.class);
    MovingAbilityCmp moveableC = entityManager().getComponent(id, MovingAbilityCmp.class);

    int cX = posC.x;
    int cY = posC.y;
    int oX = cX;
    int oY = cY;
    int cFuel = moveableC.fuel;

    // TODO

    posC.x = cX;
    posC.y = cY;

    publishEvent("unit/moved");
  }
}
