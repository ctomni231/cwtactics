package org.wolftec.cwtactics.game.system.logic;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.components.data.MovingAbilityCmp;
import org.wolftec.cwtactics.game.components.objects.Positionable;
import org.wolftec.cwtactics.game.system.ISystem;

public class MoveSystem implements ISystem {

  public void moveEntity(String id, Array<Integer> path) {
    Positionable posC = entityManager().getEntityComponent(id, Positionable.class);
    MovingAbilityCmp moveableC = entityManager().getEntityComponent(id, MovingAbilityCmp.class);

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
