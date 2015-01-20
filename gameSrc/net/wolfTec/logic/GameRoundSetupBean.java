package net.wolfTec.logic;

import net.wolfTec.Constants;
import net.wolfTec.model.CoType;
import net.wolfTec.model.GameMap;
import net.wolfTec.model.GameMode;
import net.wolfTec.model.GameRoundBean;
import net.wolfTec.model.TypeDatabase;
import net.wolfTec.model.Player;
import net.wolfTec.system.Logger;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class GameRoundSetupBean {

  public static boolean        $BEAN = true;
  public Logger                $LOG;
  private TypeDatabase<CoType> $coTypeDb;
  private GameRoundBean        $gameround;
  private LifecycleLogic       $lifecycle;

  private GameMap              map   = null;

  /**
   * Data holder to remember selected commanders.
   */
  public Array<Integer>        co    = JSCollections.$array();

  /**
   * Data holder to remember selected player types.
   */
  public Array<Integer>        type  = JSCollections.$array();

  /**
   * Data holder to remember selected team settings.
   */
  public Array<Integer>        team  = JSCollections.$array();

  public void selectMap(GameMap sMap) {
    this.map = sMap;
  }

  public GameMap getSelectedMap() {
    return map;
  }

  /**
   * Changes a configuration parameter.
   *
   * @param pid
   * @param mode
   * @param prev
   */
  public void changeParameter(int pid, ChangeMode mode, boolean prev) {
    if (mode == null) return;

    int cSelect;
    switch (mode) {

      case CO_MAIN:
        cSelect = co.$get(pid);

        if (prev) {
          cSelect--;
          if (cSelect < 0) cSelect = $coTypeDb.getIdList().$length() - 1;
        } else {
          cSelect++;
          if (cSelect >= $coTypeDb.getIdList().$length()) cSelect = 0;
        }

        co.$set(pid, cSelect);
        break;

      // ---------------------------------------------------------

      case CO_SIDE:
        $LOG.error("NotSupportedYet");
        break;

      // ---------------------------------------------------------

      case GAME_TYPE:
        GameMode gameMode = $gameround.getGameMode();
        gameMode = gameMode == GameMode.ADVANCE_WARS_1 ? GameMode.ADVANCE_WARS_1 : GameMode.ADVANCE_WARS_2;
        $gameround.setGameMode(gameMode);
        break;

      // ---------------------------------------------------------

      case PLAYER_TYPE:
        cSelect = type.$get(pid);
        if (cSelect == Constants.DESELECT_ID) break;

        if (prev) {
          cSelect--;
          if (cSelect < Constants.INACTIVE_ID) cSelect = 1;
        } else {
          cSelect++;
          if (cSelect >= 2) cSelect = Constants.INACTIVE_ID;
        }

        type.$set(pid, cSelect);
        break;

      // ---------------------------------------------------------

      case TEAM:
        cSelect = team.$get(pid);

        while (true) {

          // change selection here
          if (prev) {
            cSelect--;
            if (cSelect < 0) cSelect = 3;
          } else {
            cSelect++;
            if (cSelect >= 4) cSelect = 0;
          }

          // check team selection -> at least two different teams has to be set
          // all times
          boolean sameTeam = false;
          for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
            if (i == pid) continue;

            if (type.$get(i) >= 0 && team.$get(i) != cSelect) {
              sameTeam = true;
            }
          }

          if (sameTeam) break;
        }

        team.$set(pid, cSelect);
        break;
    }
  }

  /**
   * Does some preparations for the configuration screen.
   */
  public void preProcess() {

    // create pre-set data which would allow to start the game round (enables
    // fast game round mode)
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      co.$set(i, null);

      if (i < map.player) {
        type.$set(i, i == 0 ? 0 : 1);
        team.$set(i, i);

      } else {
        team.$set(i, Constants.DESELECT_ID);
        type.$set(i, 0);
      }
    }
  }

  /**
   * Does some preparations for the game round initialization.
   */
  public void postProcess() {

    // TODO: player one is deactivated

    // de-register old players
    // controller.ai_reset();
    // model.events.client_deregisterPlayers();

    boolean onlyAI = true;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      if (type.$get(i) == 0) {
        onlyAI = false;
        break;
      }
    }

    // update model
    int turnOwnerTeam = $gameround.getTurnOwner().team;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      Player player = $gameround.getPlayer(i);

      if (type.$get(i) >= 0) {

        player.gold = 0;
        player.team = team.$get(i);

        player.turnOwnerVisible = (player.team == turnOwnerTeam);

        if (type.$get(i) == 1) {
          // controller.ai_register(i);
          if (onlyAI) {
            player.clientControlled = true;
          }

        } else {
          player.clientControlled = true;
          player.clientVisible = true;
        }

        int coId = co.$get(i);
        player.mainCo = (coId != Constants.INACTIVE_ID) ? $coTypeDb.getSheet($coTypeDb.getIdList().$get(coId)) : null;

      } else {
        // Why another disable here ? There is the possibility that a map has
        // units for a player that
        // will be deactivated in the config screen.. so deactivate them all
        $lifecycle.deactivatePlayer(player);
      }
    }
  }
}
