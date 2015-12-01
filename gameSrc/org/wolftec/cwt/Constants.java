package org.wolftec.cwt;

public class Constants {

  public static final String NAMESPACE = "cwt";

  /**
   * Version of the game.
   */
  public static final String RELEASE_VERSION = "0.4";

  /**
   * Version name of the game.
   */
  public static final String RELEASE_NAME = "Sunrise";

  /**
   * After a state transition the complete input stack will be blocked for the
   * given amount of time.
   */
  public static final int BLOCK_INPUT_TIME = 250;

  /**
   * Controls the exact length of the logger name field in a log message. The
   * class name will be extended (with spaces) or trimmed to has the exact
   * wanted length.
   */
  public static final int LOGGER_CLASS_NAME_LENGTH = 20;

  /**
   * Style of the head part of an info log message.
   */
  public static final String LOGGER_CSS_INFO_HEAD = "color: #197519; font-weight: bold";

  /**
   * Style of the head part of a warn log message.
   */
  public static final String LOGGER_CSS_WARN_HEAD = "color: #FF7519; font-weight: bold";

  /**
   * Style of the head part of an error log message.
   */
  public static final String LOGGER_CSS_ERROR_HEAD = "color: #B20000; font-weight: bold";

  /**
   * Style of a log message.
   */
  public static final String LOGGER_CSS_TEXT = "color: #1A1A1A";

  /**
   * Determines the debug mode. Can be changed at runtime to enable/disable
   * runtime assertions and debug outputs.
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
   * URL of the active server where the game was downloaded from. This server
   * will be used to grab the game data.
   */
  public static final String SERVER_PATH = "http://localhost:80";

  public static final String DEF_MOD_PATH = "/modifications/cwt";

  /**
   * URL of the active modification where the game will download the active game
   * data. This server will be used to grab the modification file.
   */
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

  /**
   *
   */
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
  public static final int MAX_MAP_HEIGHT = 60;

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

  /**
   *
   */
  public static final int MAX_SELECTION_RANGE = 15;

  public static final int CURSOR_MOVEMENT_BLOCK_TIME = 100;

  public static final int MENU_INPUT_BLOCK_TIME = 250;

  public static final int ACTION_BUFFER_SIZE = 200;
}
