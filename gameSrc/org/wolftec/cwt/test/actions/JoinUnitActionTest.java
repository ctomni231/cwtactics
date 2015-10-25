package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.JoinUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class JoinUnitActionTest extends AbstractCwtTest {

  private JoinUnit action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_usableOnlyWhenSourceAndTargetUnitAreOfTheSameType() {
    JsUtil.throwError("test missing");
  }

  public void test_willMergeUnitStats() {
    JsUtil.throwError("test missing");
  }

  public void test_willIncreaseOwnersGoldWhenHpWouldIncreaseOverMaxValue() {
    JsUtil.throwError("test missing");
  }
}
