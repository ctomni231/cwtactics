package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.WaitUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class WaitActionTest extends AbstractCwtTest {

  private WaitUnit action;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);

    test.expectThat.everythingVisible();

    test.expectThat.unitAt(1, 1, "unitA", 0);
  }

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_action_whenNoActingUnitIsSelected_shouldBeUnavaible() {
    test.expectThat.sourceAndTargetSelectionAt(2, 2);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_action_whenActingUnitIsOwnedAndActive_shouldBeAvaible() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);

    test.modify.checkAction(action);

    test.assertThat.menu().contains(action.key());
  }

  public void test_action_whenActingUnitIsOwnedAndInactive_shouldBeUnavaible() {
    test.expectThat.everythingCannotAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_action_whenActingUnitBelongsToEnemyPlayer_shouldBeUnavaible() {
    test.expectThat.unitAt(2, 2, "unitA", 1);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(2, 2);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_action_whenActingUnitBelongsToAlliedPlayer_shouldBeUnavaible() {
    test.expectThat.unitAt(2, 2, "unitA", 2);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(2, 2);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_action_whenActivated_shouldModifyUnitData() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);

    test.modify.invokeAction(action);

    test.assertThat.unitAt(1, 1).propertyByFn((unit) -> unit.canAct).is(false);
  }
}
