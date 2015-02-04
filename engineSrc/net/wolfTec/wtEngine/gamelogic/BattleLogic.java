package net.wolfTec.wtEngine.gamelogic;

import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.wtEngine.model.AttackType;
import net.wolfTec.wtEngine.model.Unit;

@Namespace("cwt") public interface BattleLogic extends BaseLogic {

  /**
   * Returns true if the **unit** has a main weapon, else false.
   *
   * @return
   */
  default boolean hasMainWeapon(Unit unit) {
    AttackType attack = unit.getType().attack;
    return (attack != null && attack.mainWeapon != null);
  }

  /**
   * Returns true if the **unit** has a secondary weapon, else false.
   *
   * @return
   */
  default boolean hasSecondaryWeapon(Unit unit) {
    AttackType attack = unit.getType().attack;
    return (attack != null && attack.secondaryWeapon != null);
  }

  /**
   * Returns **true** if a given **unit** is an direct unit else **false**.
   *
   * @return
   */
  default boolean isDirect(Unit unit) {
    return getFireType(unit) == BattleType.DIRECT;
  }

  /**
   * Returns **true** if a given **unit** is an indirect unit ( *e.g. artillery*
   * ) else **false**.
   *
   * @return
   */
  default boolean isIndirect(Unit unit) {
    return getFireType(unit) == BattleType.INDIRECT;
  }

  /**
   * Returns **true** if a given **unit** is an ballistic unit ( *e.g.
   * anti-tank-gun* ) else **false**.
   *
   * @return
   */
  default boolean isBallistic(Unit unit) {
    return getFireType(unit) == BattleType.BALLISTIC;
  }

  /**
   * Returns **true** if an **attacker** can use it's main weapon against a
   * **defender**. The distance will not checked in case of an indirect
   * attacker.
   *
   * @param defender
   * @return
   */
  default boolean canUseMainWeapon(Unit attacker, Unit defender) {
    AttackType attack = attacker.getType().attack;
    if (attack.mainWeapon != null && attacker.getAmmo() > 0) {
      Integer value = attack.mainWeapon.$get(defender.getType().ID);
      if (value != null && value > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the fire type of a given **unit**.
   *
   * The fire type will be determined by the following situations. All other
   * situations (which aren't in the following table) aren't allowed due the
   * game rules.
   *
   * Min-Range == 1 => Ballistic Min-Range > 1 => Indirect No Min-Range =>
   * Direct Only Secondary => Direct
   *
   * @return
   */
  default BattleType getFireType(Unit unit) {
    if (!hasMainWeapon(unit) && !hasSecondaryWeapon(unit)) {
      return BattleType.NONE;
    }

    int min = unit.getType().attack.minrange;
    if (min == 1) {
      return BattleType.DIRECT;

    } else {
      return (min > 1 ? BattleType.INDIRECT : BattleType.BALLISTIC);
    }
  }

  /**
   * Returns `true` when the game is in the peace phase.
   */
  default boolean inPeacePhase() {
    return (getGameRound().getDay() < getGameConfig().getConfigValue("daysOfPeace"));
  }

}
