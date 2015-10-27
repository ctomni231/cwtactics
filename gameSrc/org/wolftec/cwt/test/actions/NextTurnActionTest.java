package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.NextTurn;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

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
    JsUtil.throwError("test missing");
  }

  public void test_shouldGiveFundsForPropertiesOfTheNewTurnOwner() {
    JsUtil.throwError("test missing");
  }

  public void test_shouldRepairNewTurnOwnerUnitsOnPropertiesOfTheNewTurnOwner() {
    JsUtil.throwError("test missing");
  }

  public void test_shouldSupplyUnitsNearTheSupplierUnitsOfTheNewTurnOwner() {
    JsUtil.throwError("test missing");
  }

  public void test_shouldDrainFuelInUnitsOfTheNewTurnOwner() {
    test.expectThat.unitType("unitA").dailyFuelDrain = 5;
    test.expectThat.unitType("unitB").dailyFuelDrain = 5;
    test.expectThat.unitType("unitB").dailyFuelDrainHidden = 5;
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
