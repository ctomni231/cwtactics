package net.temp;

import org.wolftec.core.ManagerOptions;

// TODO rename to game globals
public abstract class EngineGlobals extends ManagerOptions {

  /**
   * Current version of the running CustomWars: Tactics.
   */
  public static final String VERSION = "0.37.99-b1";

  /**
   * Symbol of inactive items.
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
  public static final int NETWORKBEAN_BUFFER_SIZE = 200;

  public static final int INPUTBEAN_STACK_SIZE = 10;
  public static final int INPUTBEAN_BUFFER_SIZE = 10;

  /**
   *
   */
  public static final int ANIMATION_TICK_TIME = 150;

  /**
   * 
   */
  public static final int MENU_ELEMENTS_MAX = 10;

  public static final int START_SCREEN_TOOLTIP_TIME = 5000;

  /**
   * 
   */
  public static final String CONFIRM_UNSUPPORTED_SYSTEM_MESSAGE = "Your system isn't supported by CW:T. Try to run it anyway?";

  /**
     *
     */
  public static final String CANNON_UNIT_INV = "CANNON_UNIT_INV";

  /**
     *
     */
  public static final String LASER_UNIT_INV = "LASER_UNIT_INV";

  /**
     *
     */
  public static final String PROP_INV = "PROP_INV";

  /**
  *
  */
  public static final String NO_MOVE = "NO_MOVE";

  public static final int LAYER_BG = 0;
  public static final int LAYER_BG_FRAMES = 1;
  public static final int LAYER_BG_FRAMETIME = 0;

  public static final int LAYER_MAP = 1;
  public static final int LAYER_MAP_FRAMES = 8;
  public static final int LAYER_MAP_FRAMETIME = 64;

  public static final int LAYER_UNIT = 2;
  public static final int LAYER_UNIT_FRAMES = 4;
  public static final int LAYER_UNIT_FRAMETIME = 160;

  public static final int LAYER_FOG = 3;
  public static final int LAYER_FOG_FRAMES = 1;
  public static final int LAYER_FOG_FRAMETIME = 0;

  public static final int LAYER_FOCUS = 4;
  public static final int LAYER_FOCUS_FRAMES = 7;
  public static final int LAYER_FOCUS_FRAMETIME = 64;

  public static final int LAYER_UI = 5;
  public static final int LAYER_UI_FRAMES = 1;
  public static final int LAYER_UI_FRAMETIME = 0;

}
