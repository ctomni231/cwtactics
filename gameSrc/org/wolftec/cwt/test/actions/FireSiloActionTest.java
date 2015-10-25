package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.FireSilo;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class FireSiloActionTest extends AbstractCwtTest {

  private FireSilo action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmptyOrSourceAndContainsNeutralProperty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.EMPTY), ActionsTest.fromMeta(TileMeta.EMPTY))).is(true);
  }

  public void test_usableOnlyOnSiloProperties() {
    JsUtil.throwError("test missing");
  }

  public void test_targetIsFreelySelectableOnMap() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsDamageToEveryUnitInRange() {
    JsUtil.throwError("test missing");
  }

  public void test_doesNotKillUnitsInRange() {
    JsUtil.throwError("test missing");
  }

}
