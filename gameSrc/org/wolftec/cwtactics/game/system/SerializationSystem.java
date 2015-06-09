package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.components.TileMap;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class SerializationSystem implements ISystem, ClickEvent {

  @Override
  public void onClick(String type, int x, int y) {
    info("GOT A CLICK TOO");
  }

  @Override
  public void onConstruction() {
    info("creating data model");

    em().acquireEntityWithId("MAP");
    TileMap map = em().acquireEntityComponent("MAP", TileMap.class);

    map.tiles = JSCollections.$array();
    for (int x = 0; x < Constants.MAX_MAP_SIDE_LENGTH; x++) {
      map.tiles.$set(x, JSCollections.$array());
      for (int y = 0; y < Constants.MAX_MAP_SIDE_LENGTH; y++) {
        map.tiles.$get(x).$set(y, null);
      }
    }
  }
}
