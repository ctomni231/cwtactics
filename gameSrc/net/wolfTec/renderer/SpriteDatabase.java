package net.wolfTec.renderer;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class SpriteDatabase {

    /** */
    public Map<String, Sprite> sprites;

    /** */
    public Map<String, String> overlayTiles;

    /** */
    public Map<String, String> longAnimatedTiles;

    /** */
    public Map<String, Integer> minimapIndex;

    public SpriteDatabase() {
        sprites = JSCollections.$map();
        overlayTiles = JSCollections.$map();
        longAnimatedTiles = JSCollections.$map();
        minimapIndex = JSCollections.$map();
    }
}
