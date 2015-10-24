package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.ActivatePower;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class ActivatePowerActionTest extends AbstractCwtTest {

  private ActivatePower action;

  @Override
  protected void prepareModel() {
    test.expectThat.everythingVisible();
  }

  public void test_sourceMustBeEmpty() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenSomethingIsSelected() {
    JsUtil.throwError("test missing");
  }

  public void test_usableWhenPlayerHasEnoughPower() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenPlayerHasNotEnoughPower() {
    JsUtil.throwError("test missing");
  }

  public void test_subMenuHasMoreLevelsToSelectWhenPlayerHasEnoughPower() {
    JsUtil.throwError("test missing");
  }

  public void test_changesPlayersActivePowerLevel() {
    JsUtil.throwError("test missing");
  }

  public void test_changesPlayersPowerValue() {
    JsUtil.throwError("test missing");
  }
}
