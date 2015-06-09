package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.EntityManager;
import org.wolftec.cwtactics.game.components.TileMap;
import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class SerializationSystem implements ConstructedClass, ClickEvent {

  private Log log;
  private EntityManager em;

  @Override
  public void onClick(String type, int x, int y) {
  }

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
