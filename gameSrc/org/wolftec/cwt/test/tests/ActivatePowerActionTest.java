package org.wolftec.cwt.test.tests;

import org.wolftec.cwt.logic.actions.ActivatePower;
import org.wolftec.cwt.logic.features.CommanderLogic;
import org.wolftec.cwt.test.AbstractCwtTest;

public class ActivatePowerActionTest extends AbstractCwtTest {

  private ActivatePower action;

  @Override
  protected void prepareModel() {
    test.expectThat.mainCo(0, "coA");
    test.expectThat.coType("coA").coStars = 1;
    test.expectThat.coType("coA").scoStars = 1;
    test.expectThat.player(0, p -> p.power = 100000);
    test.expectThat.player(0, p -> p.activePower = CommanderLogic.POWER_LEVEL_OFF);
    test.expectThat.everythingVisible();
  }

  public void test_usableWhenNothingIsSelected() {
    test.expectThat.inTeam(0, 0);
    test.expectThat.inTeam(1, 0);
    test.expectThat.inTeam(2, 1);
    test.expectThat.unitExistsAt(1, 0, "unitA", 0);
    test.expectThat.unitExistsAt(2, 0, "unitA", 1);
    test.expectThat.unitExistsAt(3, 0, "unitA", 2);
    test.expectThat.propertyAt(4, 0, "propA", 0);

    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.usableAction(action);

    // own unusable unit => acts as map action
    test.expectThat.everythingCannotAct();
    test.expectThat.sourceSelectionAt(1, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(1, 0);
    test.assertThat.unusableAction(action);

    test.expectThat.sourceSelectionAt(2, 0);
    test.assertThat.usableAction(action);

    test.expectThat.sourceSelectionAt(3, 0);
    test.assertThat.usableAction(action);

    test.expectThat.sourceSelectionAt(4, 0);
    test.assertThat.unusableAction(action);
  }

  public void test_usableOnlyWhenPlayerHasEnoughPower() {
    test.expectThat.sourceSelectionAt(0, 0);

    test.assertThat.usableAction(action);
    test.expectThat.player(0, p -> p.power = 0);
    test.assertThat.unusableAction(action);
  }

  public void test_subMenuHasMoreLevelsToSelectWhenPlayerHasEnoughPower() {
    test.expectThat.sourceSelectionAt(0, 0);

    test.expectThat.actionSubMenuOpened(action);
    test.assertThat.menu().propertyByFn(m -> m.$length()).is(2);

    test.expectThat.coType("coA").scoStars = 10000;
    test.expectThat.actionSubMenuOpened(action);
    test.assertThat.menu().propertyByFn(m -> m.$length()).is(1);
  }

  public void test_changesPlayersActivePowerLevel() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    test.expectThat.actionTriggered(action);

    test.assertThat.player(0).propertyByFn(p -> p.activePower).is(CommanderLogic.POWER_LEVEL_COP);
  }

  public void test_changesPlayersPowerValue() {
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.actionSubMenuOpened(action);
    test.expectThat.menuEntrySelected(0);
    test.expectThat.actionTriggered(action);

    test.assertThat.player(0).propertyByFn(p -> p.power).is(0);
  }
}
