package net.wolfTec.renderer;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class SpriteDatabaseBean {

    /** */
    private Map<String, Sprite> sprites;

    /** */
    private Map<String, String> overlayTiles;

    /** */
    private Map<String, String> longAnimatedTiles;

    /** */
    private Map<String, Integer> minimapIndex;

    public SpriteDatabaseBean() {
        sprites = JSCollections.$map();
        overlayTiles = JSCollections.$map();
        longAnimatedTiles = JSCollections.$map();
        minimapIndex = JSCollections.$map();
    }
}
