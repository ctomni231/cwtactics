package org.wolftec.cwtactics.game.domain.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class Map {

  public Array<Array<Tile>> mapData;

  public Map(int maxSizeX, int maxSizeY) {
    mapData = JSCollections.$array();
    for (int x = 0, xe = maxSizeX; x < xe; x++) {

      Array<Tile> column = JSCollections.$array();
      for (int y = 0, ye = maxSizeY; y < ye; y++) {
        column.push(new Tile());
      }

      mapData.push(column);
    }
  }
}
