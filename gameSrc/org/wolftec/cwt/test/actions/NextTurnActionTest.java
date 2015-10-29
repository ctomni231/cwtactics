package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.NextTurn;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.AbstractCwtTest;
import org.wolftec.cwt.test.ValueHolder;

public class NextTurnActionTest extends AbstractCwtTest {

  private NextTurn action;

  @Override
  protected void prepareModel() {
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenNothingIsSelected() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0);
    test.expectThat.unitExistsAt(1, 0, "unitA", 1);
    test.expectThat.unitExistsAt(2, 0, "unitA", 2);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);

    test.expectThat.sourceSelectionAt(3, 0);
    test.assertThat.usableAction(action);

    test.expectThat.sourceSelectionAt(1, 0);
    test.assertThat.usableAction(action);

    test.expectThat.sourceSelectionAt(2, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCannotAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.unusableAction(action);
  }

  public void test_shouldChangeTheTurnOwner() {
    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(0);
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);
    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(1);
  }

  public void test_shouldChangeDayValueWhenFirstPlayerStartsItsTurn() {
    test.assertThat.gameroundProperty(d -> d.day).is(0);
    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(0);

    for (int i = 0; i < 4; i++) {
      test.expectThat.sourceSelectionAt(0, 0);
      test.expectThat.actionTriggered(action);
    }

    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(0);
    test.assertThat.gameroundProperty(d -> d.day).is(1);
  }

  public void test_shouldEndGameWhenDayLimitIsReached() {
    test.expectThat.configValue("game.limits.days", 1);
    test.assertThat.gameroundProperty(d -> d.day).is(0);
    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(0);

    ValueHolder<String> lastNextState = new ValueHolder<>();
    for (int i = 0; i < 4; i++) {
      test.expectThat.sourceSelectionAt(0, 0);
      test.expectThat.actionTriggered(action, flow -> lastNextState.value = flow.getNextState());
    }

    test.assertThat.turnOwner().propertyByFn(p -> p.id).is(0);
    test.assertThat.gameroundProperty(d -> d.day).is(1);
    test.assertThat.value(lastNextState.value).is("IngameLeaveState");
  }

  public void test_shouldGiveFunds() {
    int GOLD = 10000;

    test.expectThat.propertyAt(0, 0, "propA", 1);
    test.expectThat.propertyType("propA").funds = GOLD;
    test.expectThat.player(1, p -> p.gold = 0);
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);

    test.assertThat.player(1).propertyByFn(o -> o.gold).is(GOLD);
  }

  public void test_shouldRepairUnitsOnProperties() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 1);
    test.expectThat.propertyAt(0, 0, "propA", 1);
    test.expectThat.unitAt(0, 0).hp = Unit.pointsToHealth(5) - 1;

    // TODO repairAmount directly as points
    test.expectThat.propertyType("propA").repairs.push("unitA");
    test.expectThat.propertyType("propA").repairAmount = Unit.pointsToHealth(2);

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 0).propertyByFn(u -> Unit.healthToPoints(u.hp)).is(7);
  }

  public void test_shouldSupplyUnitsNearSuppliers() {
    int SUPPLY_AMOUNT = 10;

    test.expectThat.unitExistsAt(1, 1, "unitA", 1);
    test.expectThat.unitExistsAt(0, 1, "unitB", 1);
    test.expectThat.unitExistsAt(2, 1, "unitB", 1);
    test.expectThat.unitType("unitA").supply.supplier = true;
    test.expectThat.unitType("unitB").ammo = SUPPLY_AMOUNT;
    test.expectThat.unitType("unitB").fuel = SUPPLY_AMOUNT;
    test.expectThat.unitAt(0, 1).ammo = 0;
    test.expectThat.unitAt(0, 1).fuel = 0;
    test.expectThat.unitAt(2, 1).ammo = 10;
    test.expectThat.unitAt(2, 1).fuel = 0;
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);

    test.assertThat.unitAt(0, 1).propertyByFn(o -> o.ammo).is(SUPPLY_AMOUNT);
    test.assertThat.unitAt(0, 1).propertyByFn(o -> o.fuel).is(SUPPLY_AMOUNT);
    test.assertThat.unitAt(2, 1).propertyByFn(o -> o.ammo).is(SUPPLY_AMOUNT);
    test.assertThat.unitAt(2, 1).propertyByFn(o -> o.fuel).is(SUPPLY_AMOUNT);
  }

  public void test_shouldDrainFuelInUnitsOfTheNewTurnOwner() {
    test.expectThat.unitType("unitA").dailyFuelDrain = 5;
    test.expectThat.unitType("unitB").dailyFuelDrain = 5;
    test.expectThat.unitType("unitB").dailyFuelDrainHidden = 10;
    test.expectThat.unitExistsAt(0, 0, "unitA", 1);
    test.expectThat.unitAt(0, 0).fuel = 10;
    test.expectThat.unitExistsAt(1, 0, "unitB", 1);
    test.expectThat.unitAt(1, 0).fuel = 15;
    test.expectThat.unitAt(1, 0).hidden = true;
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 0).propertyByFn(u -> u.fuel).is(5);
    test.assertThat.unitAt(1, 0).propertyByFn(u -> u.fuel).is(5);
  }
}
