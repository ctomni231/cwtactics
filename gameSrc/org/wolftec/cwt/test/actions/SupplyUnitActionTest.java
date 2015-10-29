package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.SupplyUnit;
import org.wolftec.cwt.test.AbstractCwtTest;

public class SupplyUnitActionTest extends AbstractCwtTest {

  private static final int MAX_AMMO = 10;
  private static final int MAX_FUEL = 90;

  private SupplyUnit action;

  @Override
  protected void prepareModel() {
    test.expectThat.unitType("unitB").supply.supplier = true;
    test.expectThat.unitType("unitA").ammo = MAX_AMMO;
    test.expectThat.unitType("unitA").fuel = MAX_FUEL;
    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenSourceIsASupplierAndWhenAtLeastOneNeighborTileIsOccupiedByAnOwnUnit() {
    test.expectThat.unitExistsAt(0, 0, "unitB", 0);
    test.expectThat.unitExistsAt(0, 3, "unitA", 0);
    test.expectThat.unitExistsAt(2, 2, "unitA", 1);
    test.expectThat.sourceSelectionAt(0, 0);

    // out of range
    test.expectThat.everythingCanAct();
    test.expectThat.targetSelectionAt(0, 1);
    test.assertThat.unusableAction(action);

    // in range
    test.expectThat.everythingCanAct();
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.usableAction(action);

    // only enemy
    test.expectThat.everythingCanAct();
    test.expectThat.targetSelectionAt(2, 1);
    test.assertThat.unusableAction(action);
  }

  public void test_changesUnitStats() {
    test.expectThat.unitExistsAt(0, 0, "unitB", 0);
    test.expectThat.unitExistsAt(0, 1, "unitA", 0);
    test.expectThat.unitAt(0, 0).ammo = 0;
    test.expectThat.unitAt(0, 0).fuel = 0;

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 0);
    test.expectThat.actionTriggered(action);

    test.assertThat.unitAt(0, 1).propertyByFn(o -> o.ammo).is(MAX_AMMO);
    test.assertThat.unitAt(0, 1).propertyByFn(o -> o.fuel).is(MAX_FUEL);
  }

}
