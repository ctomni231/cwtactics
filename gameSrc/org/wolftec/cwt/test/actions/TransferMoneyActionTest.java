package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.TransferMoney;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class TransferMoneyActionTest extends AbstractCwtTest {

  private TransferMoney action;

  @Override
  protected void prepareModel() {
  }

  public void test_sourceMustBeOwnProperty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.fromPos(TileMeta.OWN))).is(true);
  }

  public void test_subMenuContainsDifferentMoneyValues() {
    JsUtil.throwError("test missing");
  }

  public void test_changesTheGoldValuesOfTheSourceAndTargetPlayer() {
    JsUtil.throwError("test missing");
  }
}
