package org.wolftec.cwtactics.game.map;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.sysobject.Asserter;
import org.wolftec.cwtactics.game.core.sysobject.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.LoadMap;

public class TileMapSystem implements System, LoadMap {

  private Log                 log;
  private Asserter            asserter;

  private Components<TileMap> maps;

  @Override
  public void onConstruction() {
    log.info("creating data model");

    TileMap map = maps.acquire(Entities.GAME_ROUND);

    map.tiles = JSCollections.$array();
    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      map.tiles.$set(x, JSCollections.$array());
      for (int y = 0; y < Constants.MAX_MAP_SIDE_LENGTH; y++) {
        map.tiles.$get(x).$set(y, "");
      }
    }
  }

  @Override
  public void onLoadMap(String entity, Object rawData) {
    Map<String, Object> data = (Map<String, Object>) rawData;

    // maps.release(Entities.GAME_ROUND);
    // TileMap map = maps.acquireWithRootData(entity, data);
    TileMap map = maps.get(Entities.GAME_ROUND);

    for (int x = 0; x < map.tiles.$length(); x++) {
      Array<String> column = map.tiles.$get(x);
      for (int y = 0; y < column.$length(); y++) {
        asserter.inspectValue("map tile {" + x + ", " + y + "}", column.$get(y)).isEntityId();
      }
    }
  }
}
