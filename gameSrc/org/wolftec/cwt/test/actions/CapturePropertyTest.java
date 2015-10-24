package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.CaptureProperty;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class CapturePropertyTest extends AbstractCwtTest {

  private CaptureProperty capture;

  @Override
  protected void prepareModel() {
    test.expectThat.moveCosts("moveA", "tileA", 1);
    test.expectThat.everythingVisible();
  }

  public void test_sourceMustBeOwnUnit() {
    JsUtil.throwError("test missing");
  }

  public void test_targetMustBeEmptyAndEmptyOrEnemyProperty() {
    JsUtil.throwError("test missing");
  }

  public void testNoCaptureOptionOnNonUnitActions() {
    test.expectThat.sourceAndTargetSelectionAt(0, 0);

    test.modify.checkAction(capture);

    test.assertThat.menu().notContains(capture.key());
  }

  public void testCaptureOptionOnEnemyProperties() {
    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 1);
    test.expectThat.propertyAt(0, 1, "propA", 1, (prop) -> prop.points = 10);
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);

    test.modify.checkAction(capture);

    test.assertThat.menu().contains(capture.key());
  }

  public void testNoCaptureOptionOnAlliedOrOwnProperties() {
    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.propertyAt(0, 1, "propA", 0, (prop) -> prop.points = 10);
    test.expectThat.propertyAt(0, 2, "propA", 1, (prop) -> prop.points = 10);

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);

    test.modify.checkAction(capture);

    test.assertThat.menu().notContains(capture.key());

    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);

    test.modify.checkAction(capture);

    test.assertThat.menu().notContains(capture.key());
  }

  public void test_unusableTilesWithoutPropertyXXX() {
    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.sourceAndTargetSelectionAt(0, 0);

    test.modify.checkAction(capture);

    test.assertThat.menu().notContains(capture.key());
  }

  public void test_changesCapturePoints() {
    int POINTS = 20;

    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.propertyAt(0, 1, "propA", 1, (prop) -> prop.points = POINTS);
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);

    test.modify.invokeAction(capture);

    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.owner.id).is(0);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.points).lowerThen(POINTS);
  }

  public void test_changesOwnerWhenLeftCapturePointsAreZero() {
    int POINTS = 1;

    test.expectThat.unitAt(0, 0, "unitA", 0);
    test.expectThat.propertyAt(0, 1, "propA", 1, (prop) -> prop.points = POINTS);
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 1);

    test.modify.invokeAction(capture);

    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.owner.id).isNot(0);
    test.assertThat.propertyAt(0, 1).propertyByFn((prop) -> prop.points).greaterThen(0);
  }
}
