package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.collections.MoveableMatrix;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.NumberUtil;
import org.wolftec.cwt.model.gameround.GameMode;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.types.AttackType;
import org.wolftec.cwt.model.sheets.types.UnitType;

public class BattleLogic implements Injectable {

  /**
   * Signal for units that cannot attack.
   */
  public static final int FIRETYPE_NONE = 0;

  /**
   * Indirect fire type that can fire from range 2 to x.
   */
  public static final int FIRETYPE_INDIRECT = 1;

  /**
   * Direct fire type that can fire from range 1 to 1.
   */
  public static final int FIRETYPE_DIRECT = 2;

  /**
   * Ballistic fire type that can fire from range 1 to x.
   */
  public static final int FIRETYPE_BALLISTIC = 3;

  private static final int ATTACKABLE = 1;

  private static final int MOVE_AND_ATTACKABLE = 2;

  private static final int MOVABLE = 3;

  private ModelManager   model;
  private CommanderLogic co;
  private MoveLogic      move;

  public boolean hasMainWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    // TODO avoid null here
    return NullUtil.isPresent(attack) && NullUtil.isPresent(attack.main_wp);
  }

  public boolean hasSecondaryWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    // TODO avoid null here
    return NullUtil.isPresent(attack) && NullUtil.isPresent(attack.sec_wp);
  }

  public int getFireType(Unit unit) {
    if (!hasMainWeapon(unit) && !hasSecondaryWeapon(unit)) {
      return FIRETYPE_NONE;
    }

    // The fire type will be determined by the following situations. All other
    // situations (which aren't in the
    // following table) aren't allowed due the game rules.
    //
    // Min-Range === 1 --> Ballistic
    // Min-Range > 1 --> Indirect
    // No Min-Range --> Direct
    // Only Secondary --> Direct
    //

    if (unit.type.attack.minrange == 1 && unit.type.attack.maxrange == 1) {
      return FIRETYPE_DIRECT;

    } else {
      // TODO non-direct units aren't allowed to obtain secondary weapons
      return unit.type.attack.minrange > 1 ? FIRETYPE_INDIRECT : FIRETYPE_BALLISTIC;
    }
  }

  public boolean isDirect(Unit unit) {
    return getFireType(unit) == FIRETYPE_DIRECT;
  }

  public boolean isIndirect(Unit unit) {
    return getFireType(unit) == FIRETYPE_INDIRECT;
  }

  public boolean isBallistic(Unit unit) {
    return getFireType(unit) == FIRETYPE_BALLISTIC;
  }

  /**
   * 
   * @param attacker
   * @param defender
   * @return **true** if an **attacker** can use it's main weapon against a
   *         **defender**. The distance will not checked in case of an indirect
   *         attacker.
   */
  public boolean canUseMainWeapon(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;
    // TODO null prevention
    if (NullUtil.isPresent(attack.main_wp) && attacker.ammo > 0) {
      if (NullUtil.getOrElse(attack.main_wp.$get(defender.type.ID), 0) > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * 
   * @param unit
   * @param x
   * @param y
   * @param moved
   * @return **true** if an **unit** has targets in sight from a given position
   *         (**x**,**y**), else **false**. If **moved** is true, then the given
   *         **unit** will move before attack. In case of indirect units this
   *         method will return **false** then because indirect units aren't
   *         allowed to move and attack in the same turn. The method will return
   *         **true** when at least one target is in range, else **false**.
   */
  public boolean hasTargets(Unit unit, int x, int y, boolean moved) {
    if (moved && isIndirect(unit)) {
      return false;
    }
    return calculateTargets(unit, x, y, null, false);
  }

  /**
   * Calculates the targets of a **unit**. If selection **data** is given, then
   * the attack targets will be marked. If **markTiles** is true, then **data**
   * has to be given too. Furthermore when **markTiles** is true, then every
   * tile in range will be marked. The method will return **true** when at least
   * one target is in range, else **false** or **false** in every case when
   * **markTiles** is true.
   * 
   * @param unit
   * @param x
   * @param y
   * @param selection
   * @param markRangeInSelection
   * @return
   */
  public boolean calculateTargets(Unit unit, int x, int y, MoveableMatrix selection, boolean markRangeInSelection) {
    // TODO @ME REFA THIS MONSTER

    boolean markInData = NullUtil.isPresent(selection);
    int teamId = unit.owner.team;
    AttackType attackSheet = unit.type.attack;
    boolean targetInRange = false;

    // no battle unit ?
    if (NullUtil.isPresent(attackSheet)) {
      return false;
    }

    // a unit may does not have ammo but a weapon that needs ammo to fire
    if (!markRangeInSelection) {
      if (hasMainWeapon(unit) && !hasSecondaryWeapon(unit) && unit.type.ammo > 0 && unit.ammo == 0) {
        return false;
      }
    }

    // extract range
    int minR = unit.type.attack.minrange;
    int maxR = unit.type.attack.maxrange;

    int lY = y - maxR;
    int hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= model.mapHeight) {
      hY = model.mapHeight - 1;
    }
    for (; lY <= hY; lY++) {

      int lX = x - maxR;
      int hX = x + maxR;
      if (lX < 0) lX = 0;
      if (hX >= model.mapWidth) {
        hX = model.mapWidth - 1;
      }
      for (; lX <= hX; lX++) {

        Tile tile = model.getTile(lX, lY);
        int dis = model.getDistance(x, y, lX, lY);

        if (dis >= minR && dis <= maxR) {

          // if markRangeInSelection is true, then mark all tiles in range
          if (markRangeInSelection) {
            int nValue = ATTACKABLE;

            switch (selection.getValue(lX, lY)) {
              case MOVABLE:
              case MOVE_AND_ATTACKABLE:
                nValue = MOVE_AND_ATTACKABLE;
                break;
            }

            selection.setValue(lX, lY, nValue);
            continue;

          } else if (tile.visionTurnOwner == 0) {
            // drop tile when hidden in fog
            continue;

          } else {
            int dmg = Constants.INACTIVE;

            Unit tUnit = tile.unit;
            if (NullUtil.isPresent(tUnit) && tUnit.owner.team != teamId) {

              dmg = getBaseDamageAgainst(unit, tUnit);
              if (dmg > 0) {
                targetInRange = true;

                // if mark tile is true, then mark them in the selection map
                // else return true
                if (markInData) {
                  selection.setValue(lX, lY, dmg);
                } else {
                  return true;
                }
              }
            }
          }
        }
      }
    }

    return targetInRange;
  }

  public void fillRangeMap(Unit unit, int x, int y, MoveableMatrix selection) {
    selection.reset();

    if (isDirect(unit)) {

      // movable unit -> check attack from every movable position
      PositionData pdata = new PositionData();
      pdata.set(model, x, y);
      move.fillMoveMap(pdata, selection);

      selection.onAllValidPositions(0, Constants.MAX_SELECTION_RANGE, (cx, cy, cvalue) -> {
        Tile tile = model.getTile(cx, cy);
        selection.setValue(x, y, (tile.visionTurnOwner > 0 && NullUtil.isPresent(tile.unit) ? Constants.INACTIVE : MOVABLE));
      });

      selection.onAllValidPositions(MOVE_AND_ATTACKABLE, MOVABLE, (cx, cy, cvalue) -> {
        Tile tile = model.getTile(cx, cy);
        calculateTargets(tile.unit, x, y, selection, true);
        selection.setValue(x, y, ATTACKABLE);
      });

    } else {

      // non movable unit -> check attack from position {x,y}
      calculateTargets(unit, x, y, selection, true);
    }
  }

  /**
   * 
   * @param attacker
   * @param defender
   * @param withMainWp
   * @return the **base damage value as integer** of an **attacker** against a
   *         **defender**. If the attacker cannot attack the defender then
   *         **cwt.INACTIVE** will be returned. This function recognizes the
   *         ammo usage of main weapons. If the attacker cannot attack with his
   *         main weapon due low ammo then only the secondary weapon will be
   *         checked. If **withMainWp** is false (default = true) then the main
   *         weapon check will be skipped.
   */
  public int getBaseDamageAgainst(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;

    if (!NullUtil.isPresent(attack)) {
      return Constants.INACTIVE;
    }

    String tType = defender.type.ID;
    int v;

    boolean withMainWp = false;

    if (NullUtil.isPresent(attack.main_wp)) {
      withMainWp = true;
    }

    // check main weapon
    if (withMainWp && NullUtil.isPresent(attack.main_wp) && attacker.ammo > 0) {
      v = attack.main_wp.$get(tType);
      if (NullUtil.isPresent(v)) {
        return v;
      }
    }

    // check secondary weapon
    if (NullUtil.isPresent(attack.sec_wp)) {
      v = attack.sec_wp.$get(tType);
      if (NullUtil.isPresent(v)) {
        return v;
      }
    }

    return Constants.INACTIVE;
  }

  // Returns the **battle damage as integer** of an **attacker** against an
  // **defender** with a given amount of
  // **luck** as integer. If **withMainWp** is false (default = true) then the
  // main weapon usage will be skipped.
  // If **isCounter** is true (default = false), then the attack will be
  // interpreted as counter attack.
  //
  public int getBattleDamageAgainst(Unit attacker, Unit defender, int luck, boolean isCounter) {
    int BASE = getBaseDamageAgainst(attacker, defender);
    if (BASE == Constants.INACTIVE) {
      return Constants.INACTIVE;
    }

    int AHP = Unit.healthToPoints(attacker.hp);
    int LUCK = NumberUtil.asInt((luck / 100) * 10);
    int ACO = 100;
    if (isCounter) ACO += 0;

    int def = model.grabTileByUnit(defender).type.defense;
    int DCO = 100;
    int DHP = Unit.healthToPoints(defender.hp);
    int DTR = NumberUtil.asInt(def * 100 / 100);

    int damage;
    if (model.gameMode == GameMode.GAME_MODE_AW2) {
      damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);
    } else {
      damage = BASE * (ACO / 100 * DCO / 100) * (AHP / 10);
    }

    return NumberUtil.asInt(damage);
  }

  /**
   * 
   * @param attacker
   * @param defender
   * @param attLuckRatio
   * @param defLuckRatio
   */
  public void attack(Unit attacker, Unit defender, int attLuckRatio, int defLuckRatio) {
    // TODO
    // **check firstCounter:** if first counter is active then the defender
    // attacks first. In this case swap attacker and defender.
    /*
     * if (!indirectAttack && controller.scriptedValue(defender.owner,
     * "firstCounter", 0) === 1) { if (!model.battle_isIndirectUnit(defId)) {
     * var tmp_ = defender; defender = attacker; attacker = tmp_; } }
     */

    boolean indirectAttack = isIndirect(attacker);
    UnitType aSheets = attacker.type;
    UnitType dSheets = defender.type;
    Player attOwner = attacker.owner;
    Player defOwner = defender.owner;
    int powerAtt = Unit.healthToPoints(defender.hp);
    int powerCounterAtt = Unit.healthToPoints(attacker.hp);
    boolean mainWpAttack = canUseMainWeapon(attacker, defender);
    int damage = getBattleDamageAgainst(attacker, defender, attLuckRatio, false);

    if (damage != Constants.INACTIVE) {
      defender.takeDamage(damage, 0);
      if (defender.hp <= 0) {
        // TODO destroy unit
      }

      powerAtt -= Unit.healthToPoints(defender.hp);

      if (mainWpAttack) {
        attacker.ammo--;
      }

      powerAtt = NumberUtil.asInt(powerAtt * 0.1 * dSheets.costs);
      co.modifyPlayerCoPower(attOwner, NumberUtil.asInt(0.5 * powerAtt));
      co.modifyPlayerCoPower(defOwner, powerAtt);
    }

    // counter attack when defender survives and defender is an indirect
    // attacking unit
    if (defender.hp > 0 && !isIndirect(defender)) {
      mainWpAttack = canUseMainWeapon(defender, attacker);

      damage = getBattleDamageAgainst(defender, attacker, defLuckRatio, true);

      if (damage != -1) {
        attacker.takeDamage(damage, 0);
        if (attacker.hp <= 0) {
          // TODO destroy unit
        }

        powerCounterAtt -= Unit.healthToPoints(attacker.hp);

        if (mainWpAttack) {
          defender.ammo--;
        }

        powerCounterAtt = NumberUtil.asInt(powerCounterAtt * 0.1 * aSheets.costs);
        co.modifyPlayerCoPower(defOwner, NumberUtil.asInt(0.5 * powerCounterAtt));
        co.modifyPlayerCoPower(attOwner, powerCounterAtt);
      }
    }
  }
}
