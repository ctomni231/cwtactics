package org.wolftec.cwtactics.gameold.domain.managers;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.container.CircularBuffer;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wPlay.layergfx.DirectionUtil.Direction;

@ManagedComponent
public class MovePathCache implements ManagedComponentInitialization {

  public CircularBuffer<Direction> path;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    path = new CircularBuffer<Direction>(EngineGlobals.MAX_MOVE_LENGTH);
  }
}
