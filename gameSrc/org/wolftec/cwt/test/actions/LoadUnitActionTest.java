package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.LoadUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class LoadUnitActionTest extends AbstractCwtTest {

  private LoadUnit action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_usableOnlyWhenTargetUnitIsATransporterAndCanLoadSourceUnit() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenTargetTransporterIsFull() {
    JsUtil.throwError("test missing");
  }

  public void test_addsUnitInTransporter() {
    JsUtil.throwError("test missing");
  }

}
