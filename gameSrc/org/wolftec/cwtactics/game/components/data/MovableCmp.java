package org.wolftec.cwtactics.game.components.data;

import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.data.MoveType;

public class MovableCmp implements IEntityComponent {

  public int fuel;
  public int range; // TODO
  public MoveType type;
}
