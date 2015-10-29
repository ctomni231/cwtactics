package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.CaptureProperty;
import org.wolftec.cwt.test.AbstractCwtTest;

public class CapturePropertyTest extends AbstractCwtTest {

  private CaptureProperty action;

  @Override
  protected void prepareModel() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitType("unitA").captures = true;
    test.expectThat.propertyType("propA").capturable = true;
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.moveCosts("moveA", "propA", 1);
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWithOwnUnitsOnEnemyProperties() {
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);
    test.expectThat.propertyAt(0, 1, "propA", 0, (prop) -> {
      prop.owner = null;
    });
    test.expectThat.propertyAt(0, 2, "propA", 0, (prop) -> prop.points = 10);
    test.expectThat.propertyAt(0, 3, "propA", 1, (prop) -> prop.points = 10);
    test.expectThat.propertyAt(0, 4, "propA", 2, (prop) -> prop.points = 10);

    // no selection
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(5, 5);
    test.modify.checkAction(action);
    test.assertThat.menu().notContains(action.key());

    // unit selected -> neutral
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().contains(action.key());

    // unit selected -> enemy
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 4);
    test.modify.checkAction(action);
    test.assertThat.menu().contains(action.key());

    // unit selected -> own
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().notContains(action.key());

    // unit selected -> allied
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 3);
    test.modify.checkAction(action);
    test.assertThat.menu().notContains(action.key());

    // unit selected -> no property
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 5);
    test.modify.checkAction(action);
    test.assertThat.menu().notContains(action.key());
  }

  public void test_changesCapturePoints() {
    int POINTS = 20;

    test.expectThat.propertyAt(0, 1, "propA", 1, (prop) -> prop.points = POINTS);
    test.expectThat.everythingCanAct();

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);
    test.modify.invokeAction(action);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.owner.id).is(1);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.points).lowerThen(POINTS);
  }

  public void test_changesOwnerWhenLeftCapturePointsAreZero() {
    int POINTS = 1;

    test.expectThat.propertyAt(0, 1, "propA", 1, (prop) -> prop.points = POINTS);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);
    test.modify.invokeAction(action);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.owner.id).isNot(1);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.points).greaterThen(0);
  }
}
