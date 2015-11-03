package org.wolftec.cwt.test;

import org.stjs.javascript.Array;
import org.wolftec.cwt.action.TileMeta;
import org.wolftec.cwt.action.actions.TransferProperty;
import org.wolftec.cwt.test.base.AbstractCwtTest;
import org.wolftec.cwt.util.NumberUtil;

public class TransferPropertyActionTest extends AbstractCwtTest {

  private TransferProperty action;

  private int PLAYER_GOLD = 5000;
  private int FUNDS = 1000;

  @Override
  protected void prepareModel() {
    test.expectThat.player(0, (player) -> player.gold = PLAYER_GOLD);
    test.expectThat.player(1, (player) -> player.gold = PLAYER_GOLD);
    test.expectThat.propertyAt(0, 0, "propA", 0);
    test.expectThat.propertyAt(1, 0, "propB", 0);
    test.expectThat.propertyType("propA").notTransferable = true;
    test.expectThat.propertyType("propA").funds = FUNDS;
    test.expectThat.propertyType("propB").notTransferable = false;
    test.expectThat.propertyType("propB").funds = FUNDS;
  }

  public void test_sourceMustBeOwnProperty() {
    Array<TileMeta> unitMeta = ActionsTest.fromMeta(TileMeta.EMPTY, TileMeta.ENEMY, TileMeta.ALLIED, TileMeta.OWN_USED);
    Array<TileMeta> propMeta = ActionsTest.fromMeta(TileMeta.OWN);
    test.assertThat.value(ActionsTest.sourceCheck(action, unitMeta, propMeta)).is(true);
  }

  public void test_usableOnlyIfActorCanPayTheFundsOfTheProperty() {
    test.expectThat.sourceSelectionAt(1, 0);
    test.expectThat.player(0, (player) -> player.gold = FUNDS);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.sourceSelectionAt(1, 0);
    test.expectThat.player(0, (player) -> player.gold = FUNDS - 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_usableOnlyIfThePropertyIsTransferable() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();
  }

  public void test_subMenuContainsAllPlayersExceptPropertyOwner() {
    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.buildActionMenu(action);
    test.assertThat.menu().notEmpty().notContains("0");
  }

  public void test_changesOwnerOfThePropertyToTheTargetPlayer() {
    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.buildActionMenu(action);
    test.expectThat.menuEntrySelected(0);
    int newOwner = NumberUtil.asInt(test.grab.selectedMenuValue());
    test.modify.invokeAction(action);
    test.assertThat.propertyAt(1, 0).propertyByFn((prop) -> prop.owner.id).is(newOwner);
  }

  public void test_lowersTheGoldValueOfThePropertyOwnerByFundsValue() {
    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.buildActionMenu(action);
    test.expectThat.menuEntrySelected(0);
    test.modify.invokeAction(action);
    test.assertThat.player(0).propertyByFn((player) -> player.gold).is(PLAYER_GOLD - FUNDS);
  }
}
