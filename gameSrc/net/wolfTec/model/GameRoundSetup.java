package net.wolfTec.model;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.enums.GameMode;
import net.wolfTec.model.Player;
import net.wolfTec.model.PositionData;
import net.wolfTec.types.CoType;
import net.wolfTec.types.Database;
import net.wolfTec.types.GameMap;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class GameRoundSetup {

    public static enum ChangeMode {
        CO_MAIN,
        CO_SIDE,
        GAME_TYPE,
        PLAYER_TYPE,
        TEAM
    }

    private GameMap map = null;

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
                    if (cSelect < 0) cSelect = CustomWarsTactics.coTypeDb.getIdList().$length() - 1;
                } else {
                    cSelect++;
                    if (cSelect >= CustomWarsTactics.coTypeDb.getIdList().$length()) cSelect = 0;
                }

                co.$set(pid, cSelect);
                break;

            // ---------------------------------------------------------

            case CO_SIDE:
                Debug.logCritical(null, "NotSupportedYet");
                break;

            // ---------------------------------------------------------

            case GAME_TYPE:
                net.wolfTec.types.gameround.gameMode = net.wolfTec.types.gameround.gameMode == GameMode.ADVANCE_WARS_1 ?
                        GameMode.ADVANCE_WARS_1 : GameMode.ADVANCE_WARS_2;
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

                    // check team selection -> at least two different teams has to be set all times
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

        // create pre-set data which would allow to start the game round (enables fast game round mode)
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
        int turnOwnerTeam = net.wolfTec.turnOwner.team;
        for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
            Player player = net.wolfTec.types.gameround.players.$get(i);

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

                Database<CoType> coDb = CustomWarsTactics.coTypeDb;
                int coId = co.$get(i);
                player.mainCo = (coId != Constants.INACTIVE_ID) ? coDb.getSheet(coDb.getIdList().$get(coId)) : null;

            } else {
                // Why another disable here ? There is the possibility that a map has units for a player that
                // will be deactivated in the config screen.. so deactivate them all
                lifecycleLogic.deactivatePlayer(player);
            }
        }
    }
}
