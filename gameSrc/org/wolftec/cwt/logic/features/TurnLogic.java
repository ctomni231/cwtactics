package org.wolftec.cwt.logic.features;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.wotec.config.ConfigurationProvider;
import org.wolftec.cwt.wotec.ioc.Injectable;
import org.wolftec.cwt.wotec.log.Log;

public class TurnLogic implements Injectable, ConfigurationProvider {

  private Log log;

  private ModelManager model;
  private FogLogic fog;

  /**
   * 
   * @param player
   */
  public void startsTurn(Player player) {
    model.turnOwner = player;

    log.info("player " + player.id + " starts his turn");

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled) {
      model.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    int clTid = model.lastClientPlayer.team;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      Player cPlayer = model.getPlayer(i);

      cPlayer.turnOwnerVisible = false;
      cPlayer.clientVisible = false;

      // player isn't registered
      if (cPlayer.team == Constants.INACTIVE) {
        continue;
      }

      if (cPlayer.team == clTid) {
        cPlayer.clientVisible = true;
      }
      if (cPlayer.team == player.team) {
        cPlayer.turnOwnerVisible = true;
      }
    }

    model.forEachUnit((index, unit) -> {
      boolean turnStarterObject = unit.owner == player;
      unit.canAct = turnStarterObject ? true : false;
    });

    fog.fullRecalculation();
  }

  /**
   * Ends the turn for the current active turn owner.
   */
  public void stopTurn() {
    int pid = model.turnOwner.id;
    int oid = pid;

    log.info("player " + pid + " stops his turn");

    pid++;
    while (pid != oid) {

      if (pid == Constants.MAX_PLAYER) {
        pid = 0;

        // Next day
        model.day++;
        model.weatherLeftDays--;
      }

      if (model.getPlayer(pid).team != Constants.INACTIVE) {
        break;
      }

      pid++;
    }

    /*
     * If the new player id is the same as the old player id then the game aw2
     * is corrupted
     */
    AssertUtil.assertThatNot(pid == oid, "illegal game state");

    startsTurn(model.getPlayer(pid));
  }
}
