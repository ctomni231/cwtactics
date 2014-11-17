package net.wolfTec;

public abstract class Constants {

    public static final int INACTIVE_ID = -1;

    public static final int CAPTURE_POINTS = 20;
    public static final int CAPTURE_PER_STEP = 10;

    /**
     * Determines the debug mode. Can be changed at runtime to enable/disable runtime assertions and debug outputs.
     */
    public static final boolean DEBUG = true;

    /**
     * The game won't cache data when this variable is set to true.
     */
    public static final boolean DEV_NO_CACHE = false;

    /**
     * Name of the font that will be used to render text.
     */
    public static final String GAME_FONT = "Gamefont";

    /**
     * URL of the active server where the game was downloaded from. This server will be used to grab the game data.
     * TODO rename property to SERVER_PATH
     */
    public static final String MOD_PATH = "http://localhost:8000/";

    /** */
    public static final String DEFAULT_MOD_PATH = "http://localhost:8000/modifications/cwt.json";

    /**
     * Tile size base.
     */
    public static final int TILE_BASE = 16;

    /**
     * Represents a numeric code which means no data.
     */
    public static final int INACTIVE = -1;

    /**
     * Represents a numeric code which means no data.
     */
    public static final int DESELECT_ID = -2;

    /** */
    public static final int NOT_AVAILABLE = -2;

    /**
     * Screen width in tiles.
     */
    public static final int SCREEN_WIDTH = 32;

    /**
     * Screen height in tiles.
     */
    public static final int SCREEN_HEIGHT = 24;

    /**
     * Maximum width of a map.
     */
    public static final int MAX_MAP_WIDTH = 60;

    /**
     * Maximum height of a map.
     */
    public static final int MAX_MAP_HEIGHT = 40;

    /**
     * Maximum range of a move action.
     */
    public static final int MAX_MOVE_LENGTH = 15;

    /**
     * Maximum number of players.
     */
    public static final int MAX_PLAYER = 4;

    /**
     * Maximum number of properties.
     */
    public static final int MAX_PROPERTIES = 200;

    /**
     * Maximum number of units per player.
     */
    public static final int MAX_UNITS = 50;

    /** */
    public static final int MAX_SELECTION_RANGE = 15;

    /** */
    public static final int ACTION_POOL_SIZE = 200;
}
