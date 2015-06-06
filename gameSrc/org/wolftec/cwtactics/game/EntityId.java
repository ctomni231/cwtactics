package org.wolftec.cwtactics.game;

public abstract class EntityId {

  public static final String GAME_ROUND = "GAME_ROUND";
  public static final String UNIT = "UNIT_";
  public static final String PROPERTY = "PROPERTY_";

  public static String getUnitEntityId(int number) {
    return UNIT + number;
  }

  public static String getPropertyEntityId(int number) {
    return PROPERTY + number;
  }

  public static String getTileEntityId(int x, int y) {
    return "TILE_" + x + "_" + y;
  }
}
