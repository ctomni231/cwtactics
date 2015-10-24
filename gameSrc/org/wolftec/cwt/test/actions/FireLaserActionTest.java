package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.FireLaser;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class FireLaserActionTest extends AbstractCwtTest {

  private FireLaser action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.fromPos(TileMeta.OWN))).is(true);
  }

  public void test_usableOnlyWhenUnitIsALaser() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsDamageOnlyToObjectsInSameXorYProperty() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsNoDamageToTheLaserItself() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsDamageOnlyToEnemyUnits() {
    JsUtil.throwError("test missing");
  }

  public void test_wontLowerHealthPointsBelowOne() {
    JsUtil.throwError("test missing");
  }
}
