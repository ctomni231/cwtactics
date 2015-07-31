package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.config.OptionsManager;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Player;

public class TurnLogic implements Injectable {

  private OptionsManager options;
  private ModelManager   model;

  /**
   * 
   * @param player
   */
  public void startsTurn(Player player) {

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
  }

  /**
   * Ends the turn for the current active turn owner.
   */
  public void next() {
    int pid = model.turnOwner.id;
    int oid = pid;

    // Try to find next player from the player pool
    pid++;
    while (pid != oid) {

      if (pid == Constants.MAX_PLAYER) {
        pid = 0;

        // Next day
        model.day++;
        model.weatherLeftDays--;

        // TODO: into action
        int round_dayLimit = options.round_dayLimit.value;
        if (round_dayLimit > 0 && model.day >= round_dayLimit) {
          // cwt.Update.endGameRound();
          // TODO
        }
      }

      // Found next player
      if (model.getPlayer(pid).team != Constants.INACTIVE) break;

      // Try next player
      pid++;
    }

    // If the new player id is the same as the old
    // player id then the game aw2 is corrupted
    if (Constants.DEBUG) assert (pid != oid);

    // Do end/start turn logic
    model.turnOwner = model.getPlayer(pid);
    startsTurn(model.turnOwner);
  }
}
