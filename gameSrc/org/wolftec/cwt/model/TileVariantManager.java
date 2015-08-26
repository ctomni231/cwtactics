package org.wolftec.cwt.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Nullable;

public class TileVariantManager implements Injectable {

  Map<String, TileVariantInfo> types;

  private ModelManager         model;

  @Override
  public void onConstruction() {
    types = JSCollections.$map();
  }

  /**
   * Registers a tile variant information in the system.
   *
   * @param {string} type ID of the tile where the variant information will be
   *        used
   * @param {object} desc
   * @param {object} connection
   */
  public void registerVariantInfo(String type, Map<String, String> desc, Array<Array<String>> connection) {
    types.$put(type, new TileVariantInfo(desc, connection));
  }

  /**
   * Updates the variant number for every tile in the map.
   */
  public void updateTileSprites() {
    int x;
    int y;
    int xe = model.mapWidth;
    int ye = model.mapHeight;

    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        Tile tile = model.getTile(x, y);

        TileVariantInfo info = types.$get(tile.type.ID);
        // tile has variants
        if (Nullable.isPresent(info)) {
          tile.variant = info.getVariant(

          // N
          (y > 0) ? model.getTile(x, y - 1).type.ID : "",

          // E
                                         (x < model.mapWidth - 1) ? model.getTile(x + 1, y).type.ID : "",

                                         // S
                                         (y < model.mapHeight - 1) ? model.getTile(x, y + 1).type.ID : "",

                                         // W
                                         (x > 0) ? model.getTile(x - 1, y).type.ID : "",

                                         // NE
                                         (y > 0 && x < model.mapWidth - 1) ? model.getTile(x + 1, y - 1).type.ID : "",

                                         // SE
                                         (y < model.mapHeight - 1 && x < model.mapWidth - 1) ? model.getTile(x + 1, y + 1).type.ID : "",

                                         // SW
                                         (y < model.mapHeight - 1 && x > 0) ? model.getTile(x - 1, y + 1).type.ID : "",

                                         // NW
                                         (y > 0 && x > 0) ? model.getTile(x - 1, y - 1).type.ID : "");
        } else {
          tile.variant = 0;
        }
      }
    }
  }
}
