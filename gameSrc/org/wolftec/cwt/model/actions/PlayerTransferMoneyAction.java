package org.wolftec.cwt.model.actions;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.TileMeta;
import org.wolftec.cwt.model.gameround.Player;

public class PlayerTransferMoneyAction extends AbstractAction {

  /**
   * Different available money transfer steps.
   */
  public static Array<Integer> MONEY_TRANSFER_STEPS;

  public PlayerTransferMoneyAction() {
    MONEY_TRANSFER_STEPS = JSCollections.$array(1000, 2500, 5000, 10000, 25000, 50000);
  }

  @Override
  public String key() {
    return "transferMoney";
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public boolean checkTarget(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY && propertyFlag != TileMeta.OWN && propertyFlag != TileMeta.EMPTY;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Player source = controller.ui.actor;
    Player target = controller.ui.target.property.owners.getOwner();

    if (source == target) {
      return false;
    }

    if (source.gold < MONEY_TRANSFER_STEPS.$get(0)) {
      return false;
    }

    return true;
  }

  @Override
  public void prepareActionMenu(ModelData model, ControllerData controller) {
    for (int i = 0, e = MONEY_TRANSFER_STEPS.$length(); i < e; i++) {
      if (controller.ui.actor.gold >= MONEY_TRANSFER_STEPS.$get(i)) {
        controller.ui.addInfo(MONEY_TRANSFER_STEPS.$get(i) + "", true);
      }
    }
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.actor.id;
    controller.data.p2 = controller.ui.source.property.owners.getOwner().id;
    controller.data.p3 = controller.ui.actionDataCode;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Player source = model.battlefield.players.getPlayer(controller.data.p1);
    Player target = model.battlefield.players.getPlayer(controller.data.p2);
    int money = controller.data.p3;

    source.gold -= money;
    target.gold += money;

    AssertUtil.assertThat(source.gold >= 0);
  }
}
