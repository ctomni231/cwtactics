package org.wolftec.cwt.logic;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Player;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.model.Unit;

public class TeamLogic implements Injectable {

  private ModelManager         model;
  private TransportLogic       transport;

  /**
   * Different available money transfer steps.
   */
  public static Array<Integer> MONEY_TRANSFER_STEPS;

  @Override
  public void onConstruction() {
    MONEY_TRANSFER_STEPS = JSCollections.$array(1000, 2500, 5000, 10000, 25000, 50000);
  }

  //
  // Returns `true` when a player can transfer money to a tile owner.
  //
  public boolean canTransferMoney(Player player, int x, int y) {
    if (player.gold < MONEY_TRANSFER_STEPS.$get(0)) {
      return false;
    }

    // only transfer money on headquarters
    Property property = model.getTile(x, y).property;
    return (property != null && property.type.looseAfterCaptured && property.owner != player);
  }

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   * 
   * @param player
   * @param menuObject
   */
  public void getTransferMoneyTargets(Player player, Object menuObject) { // TODO
    for (int i = 0, e = MONEY_TRANSFER_STEPS.$length(); i < e; i++) {
      if (player.gold >= MONEY_TRANSFER_STEPS.$get(i)) {
        menuObject.addEntry(MONEY_TRANSFER_STEPS.$get(i));
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
  public void transferMoney(Player playerA, Player playerB, int money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    assert playerA.gold >= 0;
  }

  public boolean canTransferUnit(Unit unit) {
    return !transport.hasLoads(unit);
  }

  public void getUnitTransferTargets(Player player, Object menu) { // TODO
    int origI = player.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      if (i == origI) {
        continue;
      }

      player = model.getPlayer(i);
      if (!player.isInactive() && player.numberOfUnits < Constants.MAX_UNITS) {
        menu.addEntry(i, true);
      }
    }
  }

  public void transferUnitToPlayer(Unit unit, Player player) {
    Player origPlayer = unit.owner;

    assert player.numberOfUnits < Constants.MAX_UNITS;

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      model.searchUnit(unit, (cx, cy, cunit) -> {
        cwt.Fog.removeUnitVision(cx, cy, origPlayer);
        cwt.Fog.addUnitVision(cx, cy, cunit.owner);
      });
    }
  }

  public boolean canTransferProperty(Property property) {
    return (property.type.notTransferable != true);
  }

  public void getPropertyTransferTargets(Player player, Object menu) { // TODO
    int origI = player.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      if (i == origI) {
        continue;
      }

      player = model.getPlayer(i);
      if (!player.isInactive()) {
        menu.addEntry(i, true);
      }
    }
  }

  public void transferPropertyToPlayer(Property property, Player player) {
    Player origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      // TODO
      model.searchProperty(property, (cx, cy, cproperty) -> {
        cwt.Fog.removePropertyVision(cx, cy, origPlayer);
        cwt.Fog.addPropertyVision(cx, cy, cproperty.owner);
      }, null, origPlayer);
    }
  };
}
