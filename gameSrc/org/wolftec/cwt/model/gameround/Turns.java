package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.model.tags.TagValue;

public class Turns {

  private Log log;

  private TagValue cfgPropertyHealingEnabled;
  private TagValue cfgPropertyFundsEnabled;
  private TagValue cfgAutoSupplyAtTurnStartEnabled;
  private TagValue cfgDayLimit;

  /**
   * The current active day.
   */
  public int day;

  /**
   * The current active turn owner. Only the turn owner can do actions.
   */
  public Player turnOwner;

  public Turns() {
    log = LogFactory.byClass(Turns.class);

    cfgPropertyFundsEnabled = new TagValue("game.turnStart.funds.enabled", 0, 1, 1);
    cfgPropertyHealingEnabled = new TagValue("game.turnStart.healing.enabled", 0, 1, 1);
    cfgAutoSupplyAtTurnStartEnabled = new TagValue("game.turnStart.autoSupply", 0, 1, 1);
    cfgDayLimit = new TagValue("game.limits.days", 0, 999, 0);
  }

  public boolean isTurnOwnerObject(Ownable obj) {
    return (obj.getOwner() == turnOwner);
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

  /**
   * 
   * @param player
   */
  public void startsTurn(Player player) {
    turnOwner = player;

    log.info("player " + player.id + " starts his turn");

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled) {
      self.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    int clTid = self.lastClientPlayer.team;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      Player cPlayer = self.getPlayer(i);

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

    self.forEachUnit((index, unit) -> {
      boolean turnStarterObject = unit.owner == player;
      unit.canAct = turnStarterObject ? true : false;
    });

    if (network.isHost()) {

      if (self.day > 0 && self.day >= cfgDayLimit.value) {
        life.endGameround();
        return;
      }
    }
    self.forEachTile((x, y, tile) -> {

      if (tile.property != null && tile.property.owner == self.turnOwner) {
        if (cfgPropertyFundsEnabled.value == 1) {
          supply.raiseFunds(tile.property);
        }

        if (cfgPropertyHealingEnabled.value == 1) {
          if (supply.canPropertyRepairAt(x, y)) {
            supply.propertyRepairsAt(x, y);
          }
        }
      }

      if (tile.unit != null) {

        tile.unit.canAct = tile.unit.owner == turnOwner;

        if (tile.unit.owner == turnOwner) {
          supply.drainFuel(tile.unit);

          if (cfgAutoSupplyAtTurnStartEnabled.value == 1) {
            if (supply.isSupplier(tile.unit)) {
              if (supply.canRefillObjectAt(tile.unit, x + 1, y)) {
                supply.refillSuppliesByPosition(x + 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x - 1, y)) {
                supply.refillSuppliesByPosition(x - 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y + 1)) {
                supply.refillSuppliesByPosition(x, y + 1);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y - 1)) {
                supply.refillSuppliesByPosition(x, y - 1);
              }
            }
          }
        }
      }
    });

    fog.fullRecalculation();
  }

  /**
   * Ends the turn for the current active turn owner.
   */
  public void stopTurn() {
    int pid = turnOwner.id;
    int oid = pid;

    log.info("player " + pid + " stops his turn");

    pid++;
    while (pid != oid) {

      if (pid == Constants.MAX_PLAYER) {
        pid = 0;

        // Next day
        day++;
        self.weather.leftDays--;
      }

      if (self.getPlayer(pid).team != Constants.INACTIVE) {
        break;
      }

      pid++;
    }

    /*
     * If the new player id is the same as the old player id then the game aw2
     * is corrupted
     */
    AssertUtil.assertThatNot(pid == oid, "illegal game state");

    startsTurn(self.getPlayer(pid));
  }
}
