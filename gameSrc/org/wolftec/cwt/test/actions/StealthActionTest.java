package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.logic.actions.HideUnit;
import org.wolftec.cwt.logic.actions.UnhideUnit;
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

  public void test_usableUnhideOnlyWhenStealthUnitIsHidden() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0, (unit) -> unit.hidden = true);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().contains(unhide.key());
    test.assertThat.menu().notContains(hide.key());
  }

  public void test_usableHideOnlyWhenStealthUnitIsNotHidden() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0, (unit) -> unit.hidden = false);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().contains(hide.key());
    test.assertThat.menu().notContains(unhide.key());
  }

  public void test_unusableWhenUnitIsNotAStealth() {
    test.expectThat.unitExistsAt(0, 0, "unitB", 0, (unit) -> unit.hidden = false);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);

    test.modify.checkActions(unhide, hide);

    test.assertThat.menu().notContains(hide.key(), unhide.key());
  }

  public void test_changesUnitHiddenStatus() {
    test.expectThat.unitExistsAt(0, 0, "unitA", 0, (unit) -> unit.hidden = false);
    test.expectThat.unitExistsAt(1, 0, "unitA", 0, (unit) -> unit.hidden = true);
    test.expectThat.everythingCanAct();

    test.expectThat.sourceSelectionAt(0, 0);
    test.modify.invokeAction(hide);

    test.expectThat.sourceSelectionAt(1, 0);
    test.modify.invokeAction(unhide);

    test.assertThat.unitAt(0, 0).propertyByFn((unit) -> unit.hidden).is(true);
    test.assertThat.unitAt(1, 0).propertyByFn((unit) -> unit.hidden).is(false);
  }

}
