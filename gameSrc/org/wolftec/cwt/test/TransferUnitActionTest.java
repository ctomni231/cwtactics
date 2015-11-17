package org.wolftec.cwt.test;

import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.model.actions.UnitTransferAction;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class TransferUnitActionTest extends AbstractCwtTest {

  private UnitTransferAction action;

  @Override
  protected void prepareModel() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(1, 0, "unitA", 1);
    test.expectThat.unitExistsAt(2, 0, "unitA", 2);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.everythingCanAct();
    test.expectThat.everythingVisible();
  }

  public void test_usablyOnlyWhenOwnUnitSelected() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.sourceSelectionAt(2, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.sourceSelectionAt(3, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_usablyOnlyWhenUnitNotMoved() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    // doing a move -> action should be unavailable from now on
    test.expectThat.movePathSelected(MoveLogic.MOVE_CODES_DOWN);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_subMenuContainsAllPlayersExceptSourceUnitOwner() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.buildActionMenu(action);
    test.assertThat.menu().notEmpty().notContains("0");
  }

  public void test_changesOwnerOfTheSourceUnitToTheTargetPlayer() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.buildActionMenu(action);
    test.expectThat.menuEntrySelected(0);
    int newOwner = NumberUtil.asInt(test.grab.selectedMenuValue());
    test.modify.invokeAction(action);
    test.assertThat.unitAt(0, 0).propertyByFn((unit) -> unit.owner.id).is(newOwner);
  }
}
