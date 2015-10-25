package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.NextTurn;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class NextTurnActionTest extends AbstractCwtTest {

  private NextTurn action;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.everythingVisible();
  }

  public void test_sourceMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.EMPTY),
                                                  ActionsTest.fromMeta(TileMeta.EMPTY, TileMeta.ENEMY, TileMeta.ALLIED))).is(true);
  }

  public void test_USABLE_NOUNIT() {
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkAction(action);

    test.assertThat.menu().contains(action.key());
  }

  public void test_USABLE_UNIT_OWN_CANNOTACT() {
    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.everythingCannotAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkAction(action);

    test.assertThat.menu().contains(action.key());
  }

  public void test_UNUSABLE_UNIT_OWN_CANACT() {
    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_UNUSABLE_UNIT_ALLIED() {
    test.expectThat.unitAt(0, 0, "unitA", 1);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }

  public void test_UNUSABLE_UNIT_ENEMY() {
    test.expectThat.unitAt(0, 0, "unitA", 1);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkAction(action);

    test.assertThat.menu().notContains(action.key());
  }
}
