package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.TransferUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class TransferUnitActionTest extends AbstractCwtTest {

  private TransferUnit action;

  @Override
  protected void prepareModel() {
  }

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeSameAsSource() {
    // TODO
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_subMenuContainsAllPlayersExceptSourceUnitOwner() {
    JsUtil.throwError("test missing");
  }

  public void test_changesOwnerOfTheSourceUnitToTheTargetPlayer() {
    JsUtil.throwError("test missing");
  }
}
