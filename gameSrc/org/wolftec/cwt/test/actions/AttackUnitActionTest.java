package org.wolftec.cwt.test.actions;

import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.logic.actions.AttackUnit;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class AttackUnitActionTest extends AbstractCwtTest {

  private AttackUnit action;

  private int START_AMMO;
  private int START_HP;

  @Override
  protected void prepareModel() {
    START_HP = Unit.pointsToHealth(5) - 1;
    START_AMMO = 10;

    /* A can attack B and C. B can attack A (e.g. for counter attacks) */
    test.expectThat.unitType("unitA").attack.main_wp.$put("unitB", 10);
    test.expectThat.unitType("unitA").attack.main_wp.$put("unitC", 10);
    test.expectThat.unitType("unitA").attack.minrange = 1;
    test.expectThat.unitType("unitA").attack.maxrange = 1;
    test.expectThat.unitType("unitB").attack.main_wp.$put("unitA", 10);
    test.expectThat.unitType("unitB").attack.minrange = 1;
    test.expectThat.unitType("unitB").attack.maxrange = 1;
    test.expectThat.unitType("unitC").attack.minrange = Constants.INACTIVE;
    test.expectThat.unitType("unitC").attack.maxrange = Constants.INACTIVE;

    /* A is in team with C */
    test.expectThat.inTeam(0, 1);
    test.expectThat.inTeam(1, 2);
    test.expectThat.inTeam(2, 1);

    test.expectThat.unitExistsAt(0, 0, "unitA", 0, u -> u.ammo = START_AMMO);
    test.expectThat.unitExistsAt(0, 3, "unitB", 1, u -> u.ammo = START_AMMO);
    test.expectThat.unitExistsAt(2, 3, "unitC", 1);
    test.expectThat.unitExistsAt(4, 3, "unitC", 2);

    test.expectThat.unitAt(0, 0).hp = START_HP;
    test.expectThat.unitAt(0, 3).hp = START_HP;
    test.expectThat.unitAt(2, 3).hp = START_HP;
    test.expectThat.unitAt(4, 3).hp = START_HP;

    test.expectThat.configValue("game.daysOfPeace", 0);

    test.expectThat.everythingVisible();
  }

  public void test_usableOnlyWhenUnitCanAttackEnemyNeighbor() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.unusableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.usableAction(action);
  }

  public void test_usableForIndirectsAndBallisticsOnlyWhenTheyDontMove() {
    test.expectThat.unitType("unitA").attack.minrange = 2;
    test.expectThat.unitType("unitA").attack.maxrange = 4;

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 5);
    test.assertThat.unusableAction(action);

    test.expectThat.unitType("unitA").attack.minrange = 1;
    test.expectThat.unitType("unitA").attack.maxrange = 4;

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.assertThat.usableAction(action);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 5);
    test.assertThat.unusableAction(action);
  }

  public void test_unusableWhenGameIsInPeacePhase() {
    test.expectThat.configValue("game.daysOfPeace", 1);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.unusableAction(action);

    test.expectThat.configValue("game.daysOfPeace", 0);

    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.usableAction(action);
  }

  public void test_targetSelectionContainsTilesOccupiedByEnemyUnits() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(3, 3);
    test.expectThat.actionTargetMapOpened(action);
    test.assertThat.inTargetMap(2, 3);
    test.assertThat.notInTargetMap(4, 3);
  }

  public void test_usableWhenUnitHasAmmoOrSecondaryWeapon() {
    test.expectThat.unitAt(0, 0).ammo = 0;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.unusableAction(action);

    test.expectThat.unitType("unitA").attack.sec_wp.$put("unitB", 10);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.assertThat.usableAction(action);
  }

  public void test_inflictsDamageToDefender() {
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 3).propertyByFn(u -> u.hp).lowerThen(START_HP);
  }

  public void test_destroysDefenderWhenItsHealthIsZero() {
    test.expectThat.unitExistsAt(0, 2, "unitA", 0, u -> u.ammo = 10);
    test.expectThat.unitAt(0, 3).hp = 1;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 3).notExists();
  }

  public void test_inflictsDamageToAttackerWhenDefenderSurvivesAndCanCounter() {
    test.expectThat.unitExistsAt(0, 2, "unitA", 0, u -> u.ammo = 10);
    test.expectThat.unitExistsAt(1, 2, "unitC", 1, u -> u.ammo = 10);

    // B survives and can counter A
    test.expectThat.unitAt(0, 2).hp = START_HP;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 2).propertyByFn(u -> u.hp).lowerThen(START_HP);

    // no counter attack because B does not survives
    test.expectThat.unitAt(0, 2).hp = START_HP;
    test.expectThat.unitAt(0, 3).hp = 1;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 2).propertyByFn(u -> u.hp).is(START_HP);

    // C survives but cannot counter A
    test.expectThat.unitAt(1, 2).hp = START_HP;
    test.expectThat.unitAt(0, 2).hp = START_HP;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(1, 2);
    test.expectThat.actionTriggered(action);
    test.assertThat.unitAt(0, 2).propertyByFn(u -> u.hp).is(START_HP);
  }

  public void test_lowersAmmoWhenAttackingWithPrimaryWeapon() {
    test.expectThat.unitAt(0, 0).ammo = START_AMMO;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);

    // TODO NO MOVE IN TEST MODE -> IMPLEMENT THE REAL CASE
    test.assertThat.unitAt(0, 0).propertyByFn(u -> u.ammo).is(START_AMMO - 1);
  }

  public void test_doesNotlowersAmmoWhenAttackingWithSecondaryWeapon() {

    // A can attack B only with it's secondary weapon
    test.expectThat.unitType("unitA").attack.main_wp = JSCollections.$map();
    test.expectThat.unitType("unitA").attack.sec_wp.$put("unitB", 10);

    test.expectThat.unitAt(0, 0).ammo = START_AMMO;
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);

    // TODO NO MOVE IN TEST MODE -> IMPLEMENT THE REAL CASE
    test.assertThat.unitAt(0, 0).propertyByFn(u -> u.ammo).is(START_AMMO);
  }

  public void test_increasesPlayerPowerOfDefenderAndAttacker() {
    test.expectThat.unitType("unitA").attack.main_wp.$put("unitB", 50);
    test.expectThat.unitType("unitB").attack.main_wp.$put("unitA", 50);
    test.expectThat.unitType("unitA").costs = 100000;
    test.expectThat.unitType("unitB").costs = 100000;

    test.expectThat.player(0, p -> p.power = 0);
    test.expectThat.player(1, p -> p.power = 0);
    test.expectThat.everythingCanAct();
    test.expectThat.sourceSelectionAt(0, 0);
    test.expectThat.targetSelectionAt(0, 2);
    test.expectThat.actionSelectionAt(0, 3);
    test.expectThat.actionTriggered(action);

    test.assertThat.player(0).propertyByFn(p -> p.power).greaterThen(0);
    test.assertThat.player(1).propertyByFn(p -> p.power).greaterThen(0);
  }

}
