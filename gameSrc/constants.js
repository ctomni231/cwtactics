// Determines the debug mode. Can be changed at runtime to enable/disable runtime assertions and debug outputs.
//
exports.DEBUG = true;

// The game won't cache data when this variable is set to true.
//
exports.DEV_NO_CACHE = false;

// Name of the font that will be used to render text.
//
exports.GAME_FONT = "Gamefont";

// URL of the active server where the game was downloaded from. This server will be used to grab the
// game data.
//
// TODO: rename to SERVER_PATH
exports.MOD_PATH = "http://192.168.1.31:8000/";

exports.DEFAULT_MOD_PATH = "http://192.168.1.31:8000/modifications/cwt.json";

// Tile size base.
//
exports.TILE_BASE = 16;

// Represents a numeric code which means no data.
//
exports.INACTIVE = -1;

// Represents a numeric code which means no data.
//
exports.DESELECT_ID = -2;

// @constant
exports.NOT_AVAILABLE = -2;

// Screen width in tiles.
//
exports.SCREEN_WIDTH = 32;

// Screen height in tiles.
//
exports.SCREEN_HEIGHT = 24;

// Maximum width of a map.
//
exports.MAX_MAP_WIDTH = 60;

// Maximum height of a map.
//
exports.MAX_MAP_HEIGHT = 40;

// Maximum range of a move action.
//
exports.MAX_MOVE_LENGTH = 15;

// Maximum number of players.
//
exports.MAX_PLAYER = 4;

// Maximum number of properties.
//
exports.MAX_PROPERTIES = 200;

// Maximum number of units per player.
//
exports.MAX_UNITS = 50;

exports.MAX_SELECTION_RANGE = 15;