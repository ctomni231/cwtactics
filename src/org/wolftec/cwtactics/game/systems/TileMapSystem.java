package org.wolftec.cwtactics.game.systems;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.Entities;
import org.wolftec.cwtactics.game.components.MapData;
import org.wolftec.cwtactics.game.components.TileMap;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.syscomponent.Components;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.gameround.GameroundStart;
import org.wolftec.cwtactics.game.events.loading.LoadMap;

public class TileMapSystem implements System, LoadMap, GameroundStart {

  private Log                 log;

  private Components<TileMap> maps;
  private Components<MapData> metas;

  @Override
  public void onConstruction() {
    log.info("creating data model");
    createMatrix();
    gameroundStart();
  }

  private void createMatrix() {
    TileMap map = maps.acquire(Entities.GAME_ROUND);

    map.tiles = JSCollections.$array();
    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      map.tiles.$set(x, JSCollections.$array());
    }
  }

  @Override
  public void onLoadMap(String entity, Object rawData) {
    Map<String, Object> data = (Map<String, Object>) rawData;
    metas.acquireWithRootData(entity, data.$get(Entities.GAME_ROUND));
  }

  @Override
  public void gameroundStart() {
    TileMap map = maps.acquire(Entities.GAME_ROUND);

    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      for (int y = 0; y < Constants.MAX_MAP_SIDE_LENGTH; y++) {
        map.tiles.$get(x).$set(y, "");
      }
    }
  }
}
