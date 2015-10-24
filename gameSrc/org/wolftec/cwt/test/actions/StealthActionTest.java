package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.HideUnit;
import org.wolftec.cwt.actions.UnhideUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class StealthActionTest extends AbstractCwtTest {

  private UnhideUnit unhide;
  private HideUnit hide;

  @Override
  protected void prepareModel() {
    test.expectThat.unitType("unitA").stealth = true;
    test.expectThat.unitType("unitB").stealth = false;
    test.expectThat.everythingVisible();
  }

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(unhide, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
    test.assertThat.value(ActionsTest.sourceCheck(hide, ActionsTest.fromPos(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(unhide, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
    test.assertThat.value(ActionsTest.sourceCheck(hide, ActionsTest.fromPos(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_usableUnhideOnlyWhenStealthUnitIsHidden() {
    test.expectThat.unitAt(0, 0, "unitA", 0, (unit) -> unit.hidden = true);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().contains(unhide.key());
    test.assertThat.menu().notContains(hide.key());
  }

  public void test_usableHideOnlyWhenStealthUnitIsNotHidden() {
    test.expectThat.unitAt(0, 0, "unitA", 0, (unit) -> unit.hidden = false);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().contains(hide.key());
    test.assertThat.menu().notContains(unhide.key());
  }

  public void test_unusableWhenUnitIsNotAStealth() {
    test.expectThat.unitAt(0, 0, "unitB", 0, (unit) -> unit.hidden = false);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceAndTargetSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().notContains(hide.key(), unhide.key());
  }

  public void test_changesUnitHiddenStatus() {
    test.expectThat.unitAt(0, 0, "unitA", 0, (unit) -> unit.hidden = false);
    test.expectThat.unitAt(1, 0, "unitA", 0, (unit) -> unit.hidden = true);
    test.expectThat.everythingCanAct();

    test.expectThat.sourceAndTargetSelectionAt(0, 0);
    test.modify.invokeAction(hide);

    test.expectThat.sourceAndTargetSelectionAt(1, 0);
    test.modify.invokeAction(unhide);

    test.assertThat.unitAt(0, 0).propertyByFn((unit) -> unit.hidden).is(true);
    test.assertThat.unitAt(1, 0).propertyByFn((unit) -> unit.hidden).is(false);
  }

}
