package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.FireLaser;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class FireLaserActionTest extends AbstractCwtTest {

  private FireLaser action;

  @Override
  protected void prepareModel() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0, (o) -> o.hp = Unit.pointsToHealth(10) - 1);
    test.expectThat.unitType("unitA").laser.damage = 3;
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenUnitIsALaser() {
    test.expectThat.unitExistsAt(1, 1, "unitA", 1);
    test.expectThat.unitExistsAt(2, 2, "unitA", 2);
    test.expectThat.unitExistsAt(3, 3, "unitB", 0);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(2, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(3, 3);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_inflictsDamageOnlyToObjectsInSameXorYProperty() {
    test.expectThat.unitExistsAt(1, 0, "unitB", 1, (o) -> o.hp = Unit.pointsToHealth(5) - 1);
    test.expectThat.unitExistsAt(0, 1, "unitB", 1, (o) -> o.hp = Unit.pointsToHealth(5) - 1);
    test.expectThat.unitExistsAt(1, 1, "unitB", 1, (o) -> o.hp = Unit.pointsToHealth(5) - 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(1, 0).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(2);
    test.assertThat.unitAt(0, 1).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(2);
    test.assertThat.unitAt(1, 1).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(5);
  }

  public void test_inflictsNoDamageToTheLaserItself() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(0, 0).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(10);
  }

  public void test_inflictsDamageOnlyToEnemyUnits() {
    test.expectThat.unitExistsAt(1, 0, "unitB", 0, (o) -> o.hp = Unit.pointsToHealth(5) - 1);
    test.expectThat.unitExistsAt(0, 1, "unitB", 1, (o) -> o.hp = Unit.pointsToHealth(5) - 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(1, 0).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(5);
    test.assertThat.unitAt(0, 1).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(2);
  }

  public void test_wontLowerHealthPointsBelowOne() {
    test.expectThat.unitExistsAt(1, 0, "unitB", 1, (o) -> o.hp = Unit.pointsToHealth(2) - 1);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(action);
    test.assertThat.unitAt(1, 0).propertyByFn(o -> Unit.healthToPoints(o.hp)).is(1);
  }
}
