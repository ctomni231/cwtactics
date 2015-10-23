package org.wolftec.cwt.test;

import org.wolftec.cwt.actions.WaitUnit;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class WaitActionTest extends AbstractCwtTest {

  private WaitUnit waitAction;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.movingUnit("unitA", "moveA", 1);
    test.expectThat.everythingVisible();
    test.expectThat.unitAt(1, 1, "unitA", 0);
  }

  public void test_action_whenNoActingUnitIsSelected_shouldBeUnavaible() {
    test.expectThat.sourceAndTargetSelectionAt(2, 2);
    test.modify.checkAction(waitAction);
    test.assertThat.menu().notContains(waitAction.key());
  }

  public void test_action_whenActingUnitIsOwnedAndActive_shouldBeAvaible() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);
    test.modify.checkAction(waitAction);
    test.assertThat.menu().contains(waitAction.key());
  }

  public void test_action_whenActingUnitIsOwnedAndInactive_shouldBeUnavaible() {
    test.expectThat.everythingCannotAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);
    test.modify.checkAction(waitAction);
    test.assertThat.menu().notContains(waitAction.key());
  }

  public void test_action_whenActingUnitBelongsToEnemyPlayer_shouldBeUnavaible() {
    test.expectThat.unitAt(2, 2, "unitA", 1);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(2, 2);
    test.modify.checkAction(waitAction);
    test.assertThat.menu().notContains(waitAction.key());
  }

  public void test_action_whenActingUnitBelongsToAlliedPlayer_shouldBeUnavaible() {
    test.expectThat.unitAt(2, 2, "unitA", 2);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(2, 2);
    test.modify.checkAction(waitAction);
    test.assertThat.menu().notContains(waitAction.key());
  }

  public void test_action_whenActivated_shouldModifyUnitData() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(1, 1);
    test.modify.invokeAction(waitAction);
    test.assertThat.unitAt(1, 1).property("canAct").is(false);
  }
}
