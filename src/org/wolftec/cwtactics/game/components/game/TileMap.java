package org.wolftec.cwtactics.game.components.game;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.game.core.IEntityComponent;

public class TileMap implements IEntityComponent {
  public Array<Array<String>> tiles;

  public String getTileAt(int x, int y) {
    return tiles.$get(x).$get(y);
  }
}
