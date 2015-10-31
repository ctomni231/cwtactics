package org.wolftec.cwt.test.tests;

import org.wolftec.cwt.logic.actions.JoinUnit;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.AbstractCwtTest;

public class JoinUnitActionTest extends AbstractCwtTest {

  private JoinUnit action;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.unitExistsAt(1, 1, "unitA", 0);
    test.expectThat.unitExistsAt(2, 1, "unitA", 0);
    test.expectThat.unitExistsAt(1, 2, "unitB", 0);
    test.expectThat.unitExistsAt(0, 1, "unitA", 1);
    test.expectThat.unitExistsAt(1, 0, "unitA", 2);
    test.expectThat.unitAt(1, 1).hp = Unit.pointsToHealth(1) - 1;
    test.expectThat.unitAt(2, 1).hp = Unit.pointsToHealth(1) - 1;
    test.expectThat.unitAt(1, 1).fuel = 1;
    test.expectThat.unitAt(1, 1).ammo = 1;
    test.expectThat.unitAt(2, 1).fuel = 1;
    test.expectThat.unitAt(2, 1).ammo = 1;
    test.expectThat.unitType("unitA").ammo = 2;
    test.expectThat.unitType("unitA").fuel = 2;
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);
    test.expectThat.everythingVisible();
    test.expectThat.everythingCanAct();
  }

  public void test_usbleOnlyWhenSourceAndTargetUnitAreOfTheSameType() {

    // same types
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(2, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    // different types
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(1, 2);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_usableOnlyWhenSourceAndTargetUnitAreOfTheSameOwner() {

    // own
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(2, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().notEmpty();

    // ally
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(0, 1);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();

    // enemy
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(1, 0);
    test.modify.checkAction(action);
    test.assertThat.menu().empty();
  }

  public void test_willMergeUnitStats() {
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(2, 1);
    test.modify.invokeAction(action);
    // HINT test.assertThat.unitAt(1, 1).is(null);
    test.assertThat.unitAt(2, 1).propertyByFn((unit) -> Unit.healthToPoints(unit.hp)).is(2);
    test.assertThat.unitAt(2, 1).propertyByFn((unit) -> unit.fuel).is(2);
    test.assertThat.unitAt(2, 1).propertyByFn((unit) -> unit.ammo).is(2);
  }

  public void test_willNotMergeUnitAmmoStatsWhenNoPrimaryWeaponExists() {
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(2, 1);
    test.expectThat.unitAt(1, 1).ammo = -1;
    test.expectThat.unitAt(2, 1).ammo = -1;
    test.expectThat.unitType("unitA").ammo = -1;
    test.modify.invokeAction(action);
    test.assertThat.unitAt(2, 1).propertyByFn((unit) -> unit.ammo).is(-1);
  }

  public void test_willIncreaseOwnersGoldWhenHpWouldIncreaseOverMaxValue() {
    test.expectThat.sourceSelectionAt(1, 1);
    test.expectThat.targetSelectionAt(2, 1);
    test.expectThat.unitAt(1, 1).hp = Unit.pointsToHealth(7) - 1;
    test.expectThat.unitAt(2, 1).hp = Unit.pointsToHealth(5) - 1;
    test.expectThat.unitType("unitA").costs = 10000;
    test.expectThat.player(0, (player) -> player.gold = 0);
    test.modify.invokeAction(action);
    // HINT test.assertThat.unitAt(1, 1).is(null);
    test.assertThat.unitAt(2, 1).propertyByFn((unit) -> Unit.healthToPoints(unit.hp)).is(10);
    test.assertThat.player(0).propertyByFn((p) -> p.gold).greaterThen(0);
  }
}
