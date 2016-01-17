package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.net.NetworkManager;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;
import org.wolftec.cwt.util.AssertUtil;

public class TurnLogic implements ManagedClass, Configurable
{

  private Log log;
  private ModelManager model;
  private FogLogic fog;
  private NetworkManager network;
  private SupplyLogic supply;
  private LifecycleLogic life;

  private Configuration cfgPropertyHealingEnabled;
  private Configuration cfgPropertyFundsEnabled;
  private Configuration cfgAutoSupplyAtTurnStartEnabled;
  private Configuration cfgDayLimit;

  @Override
  public void onConstruction()
  {
    cfgPropertyFundsEnabled = new Configuration("game.turnStart.funds.enabled", 0, 1, 1);
    cfgPropertyHealingEnabled = new Configuration("game.turnStart.healing.enabled", 0, 1, 1);
    cfgAutoSupplyAtTurnStartEnabled = new Configuration("game.turnStart.autoSupply", 0, 1, 1);
    cfgDayLimit = new Configuration("game.limits.days", 0, 999, 0);
  }

  /**
   * 
   * @param player
   */
  public void startsTurn(Player player)
  {
    model.turnOwner = player;

    log.info("player " + player.id + " starts his turn");

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled)
    {
      model.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    int clTid = model.lastClientPlayer.team;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++)
    {
      Player cPlayer = model.getPlayer(i);

      cPlayer.turnOwnerVisible = false;
      cPlayer.clientVisible = false;

      // player isn't registered
      if (cPlayer.team == Constants.INACTIVE)
      {
        continue;
      }

      if (cPlayer.team == clTid)
      {
        cPlayer.clientVisible = true;
      }
      if (cPlayer.team == player.team)
      {
        cPlayer.turnOwnerVisible = true;
      }
    }

    model.forEachUnit((index, unit) ->
    {
      boolean turnStarterObject = unit.owner == player;
      unit.canAct = turnStarterObject ? true : false;
    });

    if (network.isHost())
    {

      if (model.day > 0 && model.day >= cfgDayLimit.value)
      {
        life.endGameround();
        return;
      }
    }
    model.forEachTile((x, y, tile) ->
    {

      if (tile.property != null && tile.property.owner == model.turnOwner)
      {
        if (cfgPropertyFundsEnabled.value == 1)
        {
          supply.raiseFunds(tile.property);
        }

        if (cfgPropertyHealingEnabled.value == 1)
        {
          if (supply.canPropertyRepairAt(x, y))
          {
            supply.propertyRepairsAt(x, y);
          }
        }
      }

      if (tile.unit != null)
      {

        tile.unit.canAct = tile.unit.owner == model.turnOwner;

        if (tile.unit.owner == model.turnOwner)
        {
          supply.drainFuel(tile.unit);

          if (cfgAutoSupplyAtTurnStartEnabled.value == 1)
          {
            if (supply.isSupplier(tile.unit))
            {
              if (supply.canRefillObjectAt(tile.unit, x + 1, y))
              {
                supply.refillSuppliesByPosition(x + 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x - 1, y))
              {
                supply.refillSuppliesByPosition(x - 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y + 1))
              {
                supply.refillSuppliesByPosition(x, y + 1);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y - 1))
              {
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
  public void stopTurn()
  {
    int pid = model.turnOwner.id;
    int oid = pid;

    log.info("player " + pid + " stops his turn");

    pid++;
    while (pid != oid)
    {

      if (pid == Constants.MAX_PLAYER)
      {
        pid = 0;

        // Next day
        model.day++;
        model.weatherLeftDays--;
      }

      if (model.getPlayer(pid).team != Constants.INACTIVE)
      {
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
