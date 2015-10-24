package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.ExplodeUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class ExplodeUnitActionTest extends AbstractCwtTest {

  private ExplodeUnit action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_usableOnlyWhenUnitIsExploder() {
    JsUtil.throwError("test missing");
  }

  public void test_explosionDamagesEverythingInRange() {
    JsUtil.throwError("test missing");
  }

  public void test_explosionDoesNotDestroysUnitsInRange() {
    JsUtil.throwError("test missing");
  }

  public void test_explosionDestroysExploder() {
    JsUtil.throwError("test missing");
  }

}
