package org.wolftec.cwtactics.game.components;

import org.stjs.javascript.Array;

public class TileMap {
  public Array<Array<String>> tiles;

  public String getTileAt(int x, int y) {
    return tiles.$get(x).$get(y);
  }
}
