package net.wolfTec.renderer;

import net.wolfTec.wtEngine.assets.ConnectedTile;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class TileVariantCalculator {

    private Map<String, ConnectedTile> types;

    public TileVariantCalculator () {
        this.types = JSCollections.$map();
    }

    /**
     * Registers a tile variant information in the system.
     *
     * @param type ID of the tile where the variant information will be used
     * @param desc
     * @param connection
     */
    public void registerVariantInfo (String type, Map<String, String> desc, Array<Array<String>> connection) {
        types.$put(type, new ConnectedTile(desc, connection));
    }

    /**
     * Updates the variant number for every tile in the map.
     */
    public void updateTileSprites () {
        int xe = model.mapWidth;
        int ye = model.mapHeight;
        var mapData = model.mapData;

        for (int x = 0; x < xe; x++) {
            for (int y = 0; y < ye; y++) {

                var tile = mapData[x][y];

                // tile has variants
                if (types[tile.type.ID]) {
                    tile.variant = types[tile.type.ID].getVariant(

                            // N
                            (y > 0) ? mapData[x][y - 1].type.ID : "",

                            // E
                            (x < model.mapWidth - 1) ? mapData[x + 1][y].type.ID : "",

                            // S
                            (y < model.mapHeight - 1) ? mapData[x][y + 1].type.ID : "",

                            // W
                            (x > 0) ? mapData[x - 1][y].type.ID : "",

                            // NE
                            (y > 0 && x < model.mapWidth - 1) ? mapData[x + 1][y - 1].type.ID : "",

                            // SE
                            (y < model.mapHeight - 1 && x < model.mapWidth - 1) ? mapData[x + 1][y + 1].type.ID : "",

                            // SW
                            (y < model.mapHeight - 1 && x > 0) ? mapData[x - 1][y + 1].type.ID : "",

                            // NW
                            (y > 0 && x > 0) ? mapData[x - 1][y - 1].type.ID : ""
                    );
                } else {
                    tile.variant = 0;
                }
            }
        }
    }
}
