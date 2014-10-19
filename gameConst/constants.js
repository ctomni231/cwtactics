/**
 * Determines the debug mode. Can be changed at runtime to enable/disable runtime assertions and debug outputs.
 *
 * @constant
 */
exports.DEBUG = null;

/**
 * The game won't cache data when this variable is set to true.
 *
 * @constant
 */
exports.DEV_NO_CACHE = false;

/**
 * Name of the font that will be used to render text.
 *
 * @constant
 */
exports.GAME_FONT = "Gamefont";

/**
 * URL of the active server where the game was downloaded from. This server will be used to grab the game data.
 *
 * TODO rename property to SERVER_PATH
 * @constant
 */
exports.MOD_PATH = null;

/**
 *
 *
 * @constant
 */
exports.DEFAULT_MOD_PATH = null;

/**
 * Tile size base.
 *
 * @constant
 */
exports.TILE_BASE = 16;

/**
 * Represents a numeric code which means no data.
 *
 * @constant
 */
exports.INACTIVE = -1;

/**
 * Represents a numeric code which means no data.
 *
 * @constant
 */
exports.DESELECT_ID = -2;

/**
 *
 *
 * @constant
 */
exports.NOT_AVAILABLE = -2;

/**
 * Screen width in tiles.
 *
 * @constant
 */
exports.SCREEN_WIDTH = 32;

/**
 * Screen height in tiles.
 *
 * @constant
 */
exports.SCREEN_HEIGHT = 24;

/**
 * Maximum width of a map.
 *
 * @constant
 */
exports.MAX_MAP_WIDTH = 60;

/**
 * Maximum height of a map.
 *
 * @constant
 */
exports.MAX_MAP_HEIGHT = 40;

/**
 * Maximum range of a move action.
 *
 * @constant
 */
exports.MAX_MOVE_LENGTH = 15;

/**
 * Maximum number of players.
 *
 * @constant
 */
exports.MAX_PLAYER = 4;

/**
 * Maximum number of properties.
 *
 * @constant
 */
exports.MAX_PROPERTIES = 200;

/**
 * Maximum number of units per player.
 *
 * @constant
 */
exports.MAX_UNITS = 50;

/**
 *
 *
 * @constant
 */
exports.MAX_SELECTION_RANGE = 15;