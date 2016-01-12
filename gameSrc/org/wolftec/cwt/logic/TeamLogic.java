package org.wolftec.cwt.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.util.JsUtil;

public class TeamLogic implements ManagedClass
{

  private ModelManager   model;
  private TransportLogic transport;
  private FogLogic       fog;

  /**
   * Different available money transfer steps.
   */
  public static Array<Integer> MONEY_TRANSFER_STEPS;

  @Override
  public void onConstruction()
  {
    MONEY_TRANSFER_STEPS = JSCollections.$array(1000, 2500, 5000, 10000, 25000, 50000);
  }

  //
  // Returns `true` when a player can transfer money to a tile owner.
  //
  public boolean canTransferMoney(Player source, Player target)
  {
    if (source.gold < MONEY_TRANSFER_STEPS.$get(0))
    {
      return false;
    }
    if (source == target)
    {
      return false;
    }
    return true;
  }

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   * 
   * @param player
   * @param menuObject
   */
  public void getTransferMoneyTargets(Player player, Callback1<Integer> targetCb)
  {
    for (int i = 0, e = MONEY_TRANSFER_STEPS.$length(); i < e; i++)
    {
      if (player.gold >= MONEY_TRANSFER_STEPS.$get(i))
      {
        targetCb.$invoke(MONEY_TRANSFER_STEPS.$get(i));
      }
    }
  }

  /**
   * Transfers money from one player to another player.
   * 
   * @param playerA
   * @param playerB
   * @param money
   */
  public void transferMoney(Player playerA, Player playerB, int money)
  {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    if (playerA.gold < 0)
    {
      JsUtil.throwError("IllegalGameState");
    }
  }

  public boolean canTransferUnit(Unit unit)
  {
    return !transport.hasLoads(unit);
  }

  public void getUnitTransferTargets(Player player, Callback1<Integer> targetCb)
  {
    int origI = player.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++)
    {
      if (i == origI)
      {
        continue;
      }

      player = model.getPlayer(i);
      if (!player.isInactive() && player.numberOfUnits < Constants.MAX_UNITS)
      {
        targetCb.$invoke(i);
      }
    }
  }

  public void transferUnitToPlayer(Unit unit, Player player)
  {
    Player origPlayer = unit.owner;

    if (player.numberOfUnits >= Constants.MAX_UNITS)
    {
      JsUtil.throwError("IllegalGameState");
    }

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team)
    {
      model.searchUnit(unit, (cx, cy, cunit) ->
      {
        fog.removeUnitVision(cx, cy, origPlayer);
        fog.addUnitVision(cx, cy, cunit.owner);
      });
    }
  }

  public boolean canTransferProperty(Property property)
  {
    return property.type.notTransferable != true && property.owner.gold >= property.type.funds;
  }

  public void getPropertyTransferTargets(Player player, Callback1<Integer> targetCb)
  {
    int origI = player.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++)
    {
      if (i == origI)
      {
        continue;
      }

      player = model.getPlayer(i);
      if (!player.isInactive())
      {
        targetCb.$invoke(i);
      }
    }
  }

  public void transferPropertyToPlayer(Property property, Player player)
  {
    Player origPlayer = property.owner;
    property.owner = player;

    // remove received from the property to prevent money cheating by sharing
    // the properties among a team

    origPlayer.gold -= property.type.funds;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team)
    {
      model.searchProperty(property, (cx, cy, cproperty) ->
      {
        fog.removePropertyVision(cx, cy, origPlayer);
        fog.addPropertyVision(cx, cy, cproperty.owner);
      });
    }
  };
}
