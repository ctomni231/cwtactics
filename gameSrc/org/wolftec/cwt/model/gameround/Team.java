package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.model.Specialization;

public class Team extends Specialization<Player> {

  /**
   * Different available money transfer steps.
   */
  public static Array<Integer> MONEY_TRANSFER_STEPS;

  public Team() {
    MONEY_TRANSFER_STEPS = JSCollections.$array(1000, 2500, 5000, 10000, 25000, 50000);
  }

  //
  // Returns `true` when a player can transfer money to a tile owner.
  //
  public boolean canTransferMoney(Player source, Player target) {
    if (source.gold < MONEY_TRANSFER_STEPS.$get(0)) {
      return false;
    }
    if (source == target) {
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
  public void getTransferMoneyTargets(Callback1<Integer> targetCb) {
    for (int i = 0, e = MONEY_TRANSFER_STEPS.$length(); i < e; i++) {
      if (self.gold >= MONEY_TRANSFER_STEPS.$get(i)) {
        targetCb.$invoke(MONEY_TRANSFER_STEPS.$get(i));
      }
    }
  }

  /**
   * Transfers money from one player to another self.
   * 
   * @param playerA
   * @param playerB
   * @param money
   */
  public void transferMoney(Player playerA, Player playerB, int money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    if (playerA.gold < 0) {
      JsUtil.throwError("IllegalGameState");
    }
  }

  public boolean canTransferProperty(Property property) {
    return property.type.notTransferable != true && property.owner.gold >= property.type.funds;
  }

  public void getPropertyTransferTargets(Callback1<Integer> targetCb) {
    int origI = self.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      if (i == origI) {
        continue;
      }

      player = model.getPlayer(i);
      if (!self.isInactive()) {
        targetCb.$invoke(i);
      }
    }
  }

  public void transferPropertyToPlayer(Property property, Player player) {
    AssertUtil.assertThat(property.owner == self);

    Player origPlayer = property.owner;
    property.owner = player;

    // remove received from the property to prevent money cheating by sharing
    // the properties among a team

    origPlayer.gold -= property.type.funds;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      model.searchProperty(property, (cx, cy, cproperty) -> {
        fog.removePropertyVision(cx, cy, origPlayer);
        fog.addPropertyVision(cx, cy, cproperty.owner);
      });
    }
  };
}
