package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.SupplyUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class SupplyUnitActionTest extends AbstractCwtTest {

  private SupplyUnit action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_usableOnlyWhenSourceIsASupplierAndWhenAtLeastOneNeighborTileIsOccupiedByAnOwnUnit() {
    JsUtil.throwError("test missing");
  }

  public void test_changesUnitStats() {
    JsUtil.throwError("test missing");
  }

  public void test_unitStatsWontIncreaseOverTypesMaxQuotas() {
    JsUtil.throwError("test missing");
  }

}
