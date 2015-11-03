package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.WaitUnit;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class WaitActionTest extends AbstractCwtTest {

  private WaitUnit action;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.unitExistsAt(1, 1, "unitA", 0);
    test.expectThat.unitExistsAt(2, 2, "unitA", 1);
    test.expectThat.everythingVisible();
    test.expectThat.everythingCanAct();
  }

  public void test_usableOnlyWhenOwnUnitIsSelected() {

    // own
    test.expectThat.sourceSelectionAt(1, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    // own used
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.everythingCannotAct();
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
    test.expectThat.everythingCanAct();

    // non-own
    test.expectThat.sourceSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    // nothing
    test.expectThat.sourceSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_shouldModifyUnitActivityStatus() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(1, 1).propertyByFn((unit) -> unit.canAct).is(false);
  }
}
