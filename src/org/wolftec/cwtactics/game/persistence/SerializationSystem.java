package org.wolftec.cwtactics.game.persistence;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.map.TileMap;

public class SerializationSystem implements System {

  private Log log;
  private EntityManager em;

  @Override
  public void onConstruction() {
    log.info("creating data model");

    em.acquireEntityWithId("MAP");
    TileMap map = em.acquireEntityComponent("MAP", TileMap.class);

    map.tiles = JSCollections.$array();
    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      map.tiles.$set(x, JSCollections.$array());
      for (int y = 0; y < Constants.MAX_MAP_SIDE_LENGTH; y++) {
        map.tiles.$get(x).$set(y, null);
      }
    }
  }
}
