package org.wolftec.cwtactics.game.state.menu;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.managers.TypeManager;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.GameMode;
import org.wolftec.cwtactics.game.domain.model.Player;
import org.wolftec.cwtactics.game.domain.types.MapFileType;
import org.wolftec.cwtactics.game.logic.ChangeMode;
import org.wolftec.cwtactics.game.logic.LifecycleLogic;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;

@ManagedComponent
public class GameRoundSetupBean {

  @ManagedConstruction
  public Logger log;

  @Injected
  private TypeManager typeDb;

  @Injected
  private GameManager gameround;

  @Injected
  private LifecycleLogic lifecycle;

  public MapFileType map = null;

  /**
   * Data holder to remember selected commanders.
   */
  public Array<Integer> co = JSCollections.$array();

  /**
   * Data holder to remember selected player types.
   */
  public Array<Integer> type = JSCollections.$array();

  /**
   * Data holder to remember selected team settings.
   */
  public Array<Integer> team = JSCollections.$array();

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
          if (cSelect < 0) cSelect = typeDb.getCommanderTypes().$length() - 1;
        } else {
          cSelect++;
          if (cSelect >= typeDb.getCommanderTypes().$length()) cSelect = 0;
        }

        co.$set(pid, cSelect);
        break;

      // ---------------------------------------------------------

      case CO_SIDE:
        log.error("NotSupportedYet");
        break;

      // ---------------------------------------------------------

      case GAME_TYPE:
        GameMode gameMode = gameround.gameMode;
        gameMode = gameMode == GameMode.ADVANCE_WARS_1 ? GameMode.ADVANCE_WARS_1
            : GameMode.ADVANCE_WARS_2;
        gameround.gameMode = gameMode;
        break;

      // ---------------------------------------------------------

      case PLAYER_TYPE:
        cSelect = type.$get(pid);
        if (cSelect == EngineGlobals.DESELECT_ID) break;

        if (prev) {
          cSelect--;
          if (cSelect < EngineGlobals.INACTIVE_ID) cSelect = 1;
        } else {
          cSelect++;
          if (cSelect >= 2) cSelect = EngineGlobals.INACTIVE_ID;
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
          for (int i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
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
    for (int i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
      co.$set(i, null);

      if (i < map.maxPlayers) {
        type.$set(i, i == 0 ? 0 : 1);
        team.$set(i, i);

      } else {
        team.$set(i, EngineGlobals.DESELECT_ID);
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
    for (int i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
      if (type.$get(i) == 0) {
        onlyAI = false;
        break;
      }
    }

    // update model
    int turnOwnerTeam = gameround.turnOwner.team;
    for (int i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
      Player player = gameround.players.$get(i);

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
        player.mainCo = (coId != EngineGlobals.INACTIVE_ID) ? typeDb.getCommanderType(typeDb
            .getCommanderTypes().$get(coId).ID) : null;

      } else {
        // Why another disable here ? There is the possibility that a map has
        // units for a player that
        // will be deactivated in the config screen.. so deactivate them all
        lifecycle.deactivatePlayer(player);
      }
    }
  }
}
