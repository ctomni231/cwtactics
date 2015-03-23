package org.wolftec.cwtactics.game.domain.managers;

import org.wolftec.container.CircularBuffer;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.system.layergfx.DirectionUtil.Direction;

@ManagedComponent
public class MovePathCache implements ManagedComponentInitialization {

  public CircularBuffer<Direction> path;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    path = new CircularBuffer<Direction>(EngineGlobals.MAX_MOVE_LENGTH);
  }
}
