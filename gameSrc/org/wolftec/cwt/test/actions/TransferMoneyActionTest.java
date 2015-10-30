package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.TransferMoney;
import org.wolftec.cwt.logic.features.TeamLogic;
import org.wolftec.cwt.test.AbstractCwtTest;
import org.wolftec.cwt.util.NumberUtil;
import org.wolftec.wTec.action.TileMeta;

public class TransferMoneyActionTest extends AbstractCwtTest {

  private TransferMoney action;

  private int minTransferMoney;

  @Override
  protected void prepareModel() {
    minTransferMoney = TeamLogic.MONEY_TRANSFER_STEPS.$get(0);

    test.expectThat.player(0, (player) -> player.gold = minTransferMoney);
    test.expectThat.player(1, (player) -> player.gold = 0);
    test.expectThat.propertyAt(0, 0, "propA", 1);
    test.expectThat.propertyType("propA").looseAfterCaptured = true;
    test.expectThat.sourceSelectionAt(0, 0);
  }

  public void test_targetMustBeAlliedOrEnemyProperty() {
    test.assertThat.value(ActionsTest.targetCheck(action, ActionsTest.fromMeta(TileMeta.EMPTY),
                                                  ActionsTest.fromMeta(TileMeta.ALLIED, TileMeta.ENEMY))).is(true);
  }

  public void test_usableOnlyWhenPropertyIsCritical() {
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();
    test.expectThat.propertyType("propA").looseAfterCaptured = false;
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_usableOnlyWhenActorHasEnoughMoney() {
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();
    test.expectThat.player(0, (player) -> player.gold = minTransferMoney - 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_actionMenuContainsAtLeastOneValue() {
    test.expectThat.player(0, (player) -> player.gold = minTransferMoney);
    test.modify.buildActionMenu(action);
    test.assertThat.menu().notEmpty();
  }

  public void test_changesTheGoldValuesOfTheSourceAndTargetPlayer() {
    test.modify.buildActionMenu(action);
    test.expectThat.menuEntrySelected(0);
    int transferedMoney = NumberUtil.asInt(test.grab.selectedMenuValue());
    test.modify.invokeAction(action);
    test.assertThat.player(0).propertyByFn((player) -> player.gold).is(minTransferMoney - transferedMoney);
    test.assertThat.player(1).propertyByFn((player) -> player.gold).is(transferedMoney);
  }
}
