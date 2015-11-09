package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.GoToOptions;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class GoToOptionsActionTest extends AbstractCwtTest {

  private GoToOptions action;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.unitExistsAt(1, 1, "unitA", 0);
    test.expectThat.propertyAt(0, 0, "propA", 0);
    test.expectThat.everythingCanAct();
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenNothingActableIsSelected() {
    test.expectThat.sourceSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.sourceSelectionAt(1, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_movesTheUiIntoTheOptionsState() {
    test.expectThat.sourceSelectionAt(2, 2);
    test.modify.invokeAction(action, (flow) -> {
      test.assertThat.value(flow.getNextState()).exists();
    });
  }
}
