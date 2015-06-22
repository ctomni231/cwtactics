package org.wolftec.cwtactics;

public class Constants {

  public static final int COMMAND_BUFFER_SIZE = 200;

  public static final int UNIT_HEALTH = 99;

  /**
   * The version of the game build.
   */
  public static final String VERSION = "0.40";

  /**
   * The expected number of characters in an object identifier.
   */
  public static final int IDENTIFIER_LENGTH = 4;

  /**
   * Internal screen height in pixel.
   */
  public static final int SCREEN_HEIGHT_PX = 480;

  /**
   * Internal screen width in pixel.
   */
  public static final int SCREEN_WIDTH_PX = 640;

  /**
   * Maximum range of a selection.
   */
  public static final int MAX_SELECTION_RANGE = 15;

  public static final int MAX_TRANSPORTER_LOADS = 5;

  public static final int MAX_PLAYERS = 4;

  /**
   * The version of the game build.
   */
  public static final String NAMESPACE = "cwt";

  /**
   * Controls the exact length of the logger name field in a log message. The
   * class name will be extended (with spaces) or trimmed to has the exact
   * wanted length.
   */
  public static final int LOGGER_CLASS_NAME_LENGTH = 20;

  public static final String LOGGER_CSS_INFO_HEAD = "color: #197519; font-weight: bold";

  public static final String LOGGER_CSS_WARN_HEAD = "color: #FF7519; font-weight: bold";

  public static final String LOGGER_CSS_ERROR_HEAD = "color: #B20000; font-weight: bold";

  public static final String LOGGER_CSS_TEXT = "color: #1A1A1A";

  public static final int OFFLINE_DB_SIZE = 50;

  public static final String OFFLINE_DB_NAME = "CWT-DB";

  public static final int MAX_MAP_SIDE_LENGTH = 50;
}
