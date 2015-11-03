package org.wolftec.cwt.test;

import org.wolftec.cwt.action.actions.ExplodeUnit;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.base.AbstractCwtTest;

public class ExplodeUnitActionTest extends AbstractCwtTest {

  private ExplodeUnit action;

  @Override
  protected void prepareModel() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitType("unitA").suicide.damage = 3;
    test.expectThat.unitType("unitA").suicide.range = 2;
    test.expectThat.unitExistsAt(1, 0, "unitA", 1);
    test.expectThat.unitExistsAt(0, 1, "unitB", 1);
    test.expectThat.unitExistsAt(1, 1, "unitB", 0);
    test.expectThat.unitAt(1, 0).hp = Unit.pointsToHealth(5) - 1;
    test.expectThat.unitAt(0, 1).hp = Unit.pointsToHealth(2) - 1;
    test.expectThat.unitAt(1, 1).hp = Unit.pointsToHealth(10) - 1;
    test.expectThat.everythingCanAct();
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenUnitIsExploder() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.sourceSelectionAt(1, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_explosionDamagesEverythingInRange() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(1, 0).propertyByFn((o) -> Unit.healthToPoints(o.hp)).is(2);
    test.assertThat.unitAt(0, 1).propertyByFn((o) -> Unit.healthToPoints(o.hp)).is(1);
    test.assertThat.unitAt(1, 1).propertyByFn((o) -> Unit.healthToPoints(o.hp)).is(7);
  }

  public void test_explosionDoesNotDestroysUnitsInRange() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(0, 1).exists();
  }

  public void test_explosionDestroysExploder() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(0, 0).notExists();
  }

}
