package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.game.EntityId;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.game.TileMap;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.System;
import org.wolftec.cwtactics.game.event.persistence.MapLoadEvent;

public class TileMapSystem implements System, MapLoadEvent {

  private EntityManager em;
  private Asserter asserter;

  @Override
  public void onMapLoad(Map<String, Object> data) {
    em.detachEntityComponentByClass(EntityId.GAME_ROUND, TileMap.class);
    em.tryAcquireComponentFromDataSuccessCb(EntityId.GAME_ROUND, data, TileMap.class, (map) -> {
      for (int x = 0; x < map.tiles.$length(); x++) {
        Array<String> column = map.tiles.$get(x);
        for (int y = 0; y < column.$length(); y++) {
          asserter.inspectValue("map tile {" + x + ", " + y + "}", column.$get(y)).isEntityId();
        }
      }
    });
  }
}
