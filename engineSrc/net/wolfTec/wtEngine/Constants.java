package net.wolfTec.wtEngine;

public abstract class Constants {

  /**
   * Current version of the running CustomWars: Tactics.
   */
  public static final String VERSION = "0.3.799-b1";

  /**
   *
   */
  public static final int INACTIVE_ID = -1;

  /**
   * Amount of capture points that needs to be lowered by a capturer to
   * completely capture property.
   */
  public static final int CAPTURE_POINTS = 20;

  /**
   *
   */
  public static final int CAPTURE_PER_STEP = 10;

  /**
   *
   */
  public static final int INPUT_STACK_BUFFER_SIZE = 10;

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
   * will be used to grab the game data. TODO rename property to SERVER_PATH
   */
  public static final String MOD_PATH = "http://localhost:8000/";

  /**
   *
   */
  public static final String DEFAULT_MOD_PATH = "http://localhost:8000/modifications/cwt.json";

  /**
   * Tile size base.
   */
  public static final int TILE_BASE = 16;

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

  /**
   *
   */
  public static final int MAX_SELECTION_RANGE = 15;

  /**
   *
   */
  public static final int ACTION_POOL_SIZE = 200;

  /**
   *
   */
  public static final int ANIMATION_TICK_TIME = 150;

  /**
   * 
   */
  public static final int MENU_ELEMENTS_MAX = 10;

  public static final String STORAGE_PARAMETER_CACHED_CONTENT = "cwt_gameContent_cached";

  public static final String STORAGE_PARAMETER_MAP_PREFIX = "cwt_map_";

  public static final String STORAGE_PARAMETER_IMAGE_PREFIX = "cwt_image_";

  public static final String STORAGE_PARAMETER_SAVEGAME_PREFIX = "cwt_savegame_";

  // TODO - BIND THAT 3 CONFIGS TOGETHER ?
  
  public static final String STORAGE_PARAMETER_INPUT_MAPPING = "cwt_input_mapping";
  
  public static final String STORAGE_PARAMETER_AUDIO_VOLUME = "cwt_aduio_volume";
  
  public static final String STORAGE_PARAMETER_APPLICATION_CONFIG = "cwt_app_config";

  // END OF - TODO - BIND THAT 3 CONFIGS TOGETHER ?
}
