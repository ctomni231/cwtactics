package net.wolfTec.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt")
public class Map {

    private Array<Array<Tile>> mapData;
    private int maxX;
    private int maxY;

    public Map(int sizeX, int sizeY) {
        this.maxX = sizeX;
        this.maxY = sizeY;

        mapData = JSCollections.$array();
        for (int x = 0; x < sizeX; x++) {
            Array<Tile> column = JSCollections.$array();
            mapData.push(column);
        }
    }

    public Tile getTile( int x, int y) {
        return mapData.$get(x).$get(y);
    }
}
