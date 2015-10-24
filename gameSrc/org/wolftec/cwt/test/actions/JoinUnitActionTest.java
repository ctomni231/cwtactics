package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.JoinUnit;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class JoinUnitActionTest extends AbstractCwtTest {

  private JoinUnit action;

  public void test_sourceMustBeOwnUnit() {
    JsUtil.throwError("test missing");
  }

  public void test_targetMustBeOwnUnitAndNotTheSameAsSource() {
    JsUtil.throwError("test missing");
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
