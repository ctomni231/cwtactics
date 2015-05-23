package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.components.data.MovableCmp;
import org.wolftec.cwtactics.game.components.objects.Positionable;

public class Move implements ISystem {

  public void moveEntity(String id, Array<Integer> path) {
    Positionable posC = entityManager().getEntityComponent(id, Positionable.class);
    MovableCmp moveableC = entityManager().getEntityComponent(id, MovableCmp.class);

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
