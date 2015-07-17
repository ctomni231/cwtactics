package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Movemap implements Component {
  public int                   top;
  public int                   left;
  public Array<Array<Integer>> data;
}
