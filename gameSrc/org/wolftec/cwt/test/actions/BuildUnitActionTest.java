package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.BuildUnit;
import org.wolftec.cwt.core.util.SheetIdNumberUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class BuildUnitActionTest extends AbstractCwtTest {

  private BuildUnit action;

  @Override
  protected void prepareModel() {

    // building needs the 4 letter uppercase code ID's
    test.expectThat.unitTypeExists("UNIA");
    test.expectThat.unitTypeExists("UNIB");
    test.expectThat.unitTypeExists("UNIC");

    test.expectThat.propertyType("propA").builds.push("UNIA", "UNIB", "UNIC");
    test.expectThat.unitType("UNIA").costs = 1000;
    test.expectThat.unitType("UNIB").costs = 10000;
    test.expectThat.unitType("UNIC").costs = 100000;
    test.expectThat.propertyAt(0, 0, "propA", 0);
    test.expectThat.propertyAt(1, 0, "propB", 0);
    test.expectThat.everythingVisible();
    test.expectThat.player(0, p -> p.gold = 10000);
    test.expectThat.player(0, p -> p.manpower = 10000);
  }

  public void test_usableWhenPropertyIsAFactory() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.usableAction(action);

    test.expectThat.sourceSelectionAt(1, 0);
    test.assertThat.unusableAction(action);
  }

  public void test_unusableWhenTileIsOccupiedByAnUnit() {
    test.expectThat.unitExistsAt(0, 0, "UNIA", 0);
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.unusableAction(action);
  }

  public void test_submenuContainsOnlyTypesWhichPayableByOwner() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.assertThat.menu().contains("UNIA", "UNIB");
  }

  public void test_submenuContainsOnlyNonBlockedTypes() {
    test.expectThat.unitType("UNIB").blocked = true;
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.assertThat.menu().contains("UNIA");
  }

  public void test_buildsUnitOnFactory() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    uiData.actionDataCode = SheetIdNumberUtil.toNumber(uiData.actionData);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 0).exists();
    test.assertThat.unitAt(0, 0).propertyByFn(u -> u.type.ID).is("UNIA");
  }

  public void test_buildedUnitIsUnusable() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    uiData.actionDataCode = SheetIdNumberUtil.toNumber(uiData.actionData);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 0).propertyByFn(u -> u.canAct).is(false);
  }

}
