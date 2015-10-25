package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.LoadUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class BuildUnitActionTest extends AbstractCwtTest {

  private LoadUnit action;

  public void test_sourceMustBeOwnProperty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.EMPTY), ActionsTest.fromMeta(TileMeta.OWN))).is(true);
  }

  public void test_usableWhenPropertyIsAFactory() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenTileIsOccupiedByAnUnit() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenPropertyIsntAFactory() {
    JsUtil.throwError("test missing");
  }

  public void test_submenuContainsTypesWhichCostsAreLowerEqualsOwnersGold() {
    JsUtil.throwError("test missing");
  }

  public void test_submenuContainsDeactivatedTypesWhichCostsAreGreaterThenOwnersGold() {
    JsUtil.throwError("test missing");
  }

  public void test_buildsUnitOnFactory() {
    JsUtil.throwError("test missing");
  }

  public void test_buildedUnitIsUnusable() {
    JsUtil.throwError("test missing");
  }

}
