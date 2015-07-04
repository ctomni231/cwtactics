package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.IEntityComponent;

public class Movemap implements IEntityComponent {
  public int top;
  public int left;
  public Array<Array<Integer>> data;
}
