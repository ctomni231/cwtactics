package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.AttackUnit;
import org.wolftec.cwt.core.action.TileMeta;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class AttackUnitActionTest extends AbstractCwtTest {

  private AttackUnit action;

  public void test_sourceMustBeOwnUnit() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.OWN), ActionsTest.allPos())).is(true);
  }

  public void test_targetMustBeEmpty() {
    test.assertThat.value(ActionsTest.sourceCheck(action, ActionsTest.fromMeta(TileMeta.EMPTY), ActionsTest.allPos())).is(true);
  }

  public void test_usableWhenUnitCanAttackEnemyNeighbor() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenUnitCannotAttackEnemyNeighbor() {
    JsUtil.throwError("test missing");
  }

  public void test_usableWhenSourceIsNotTargetAndAttackIsNotIndirect() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenSourceIsNotTargetAndAttackIsIndirect() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenGameIsInPeacePhase() {
    JsUtil.throwError("test missing");
  }

  public void test_targetSelectionContainsTilesOccupiedByEnemyUnits() {
    JsUtil.throwError("test missing");
  }

  public void test_unusableWhenUnitCanAttackOnlyWithPrimaryWeaponAndHasNoAmmo() {
    JsUtil.throwError("test missing");
  }

  public void test_usableWhenUnitCanAttackWithSecondaryWeaponAndHasNoAmmo() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsDamageToDefender() {
    JsUtil.throwError("test missing");
  }

  public void test_inflictsDamageToAttackerWhenDefenderSurvivesAndCanCounter() {
    JsUtil.throwError("test missing");
  }

  public void test_destroysDefenderWhenItsHealthIsZero() {
    JsUtil.throwError("test missing");
  }

  public void test_lowersAmmoWhenAttackingWithPrimaryWeapon() {
    JsUtil.throwError("test missing");
  }

  public void test_doesNotlowersAmmoWhenAttackingWithSecondaryWeapon() {
    JsUtil.throwError("test missing");
  }

  public void test_increasesPlayerPowerOfDefenderAndAttacker() {
    JsUtil.throwError("test missing");
  }

}
