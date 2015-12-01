package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.Constants;

public class Turns {

  /**
   * The current active day.
   */
  public int day;

  /**
   * The current active turn owner. Only the turn owner can do actions.
   */
  public Player turnOwner;

  public boolean isTurnOwnerObject(Ownable obj) {
    return obj.getOwner() == turnOwner;
  }

  /**
   * 
   * @param player
   * @return true if the given player id is the current turn owner, else false
   */
  public boolean isTurnOwner(Player player) {
    return turnOwner == player;
  }

  /**
   * Converts a number of days into turns.
   * 
   * @param days
   * @return
   */
  public int convertDaysToTurns(int days) {
    return Constants.MAX_PLAYER * days;
  }
}
