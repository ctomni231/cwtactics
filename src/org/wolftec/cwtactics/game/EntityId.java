package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.Constants;

public abstract class EntityId {

  public static final String NOTHING = "__NOTHING__";
  public static final String GAME_UI = "GAME_UI";
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

  private static Array<String> playerIds;

  public static boolean isFirstPlayer(String player) {
    if (playerIds == null) {
      createPlayerIds();
    }
    return playerIds.$get(0) == player;
  }

  public static String getNextPlayerId(String player) {
    if (playerIds == null) {
      createPlayerIds();
    }
    int curIndex = playerIds.indexOf(player);
    if (curIndex == -1) return null; // TODO
    return playerIds.$get(curIndex < Constants.MAX_PLAYERS - 1 ? curIndex + 1 : 0);
  }

  private static void createPlayerIds() {
    playerIds = JSCollections.$array();
    for (int i = 0; i < Constants.MAX_PLAYERS; i++) {
      playerIds.push("PL" + i);
    }
  }

  public static boolean isUnitEntity(String entity) {
    return entity.startsWith(UNIT);
  }
}
