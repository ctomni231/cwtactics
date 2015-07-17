package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class TileMap implements Component {
  public Array<Array<String>> tiles;

  public String getTileAt(int x, int y) {
    return tiles.$get(x).$get(y);
  }
}
