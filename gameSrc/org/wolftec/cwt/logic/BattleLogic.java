package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.MatrixSegment;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.types.AttackType;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.NumberUtil;

public class BattleLogic implements ManagedClass, Configurable {

  /**
   * Maximum amount of luck for an attacker. This number will be used exclusive
   * which means variable -1 is the maximum.
   */
  private static final int MAX_LUCK_EXCLUSIVE = 11;

  private static final int FIRETYPE_NONE = 0;
  private static final int FIRETYPE_INDIRECT = 1;
  private static final int FIRETYPE_DIRECT = 2;
  private static final int FIRETYPE_BALLISTIC = 3;

  private static final int ATTACKABLE = 1;
  private static final int MOVE_AND_ATTACKABLE = 2;
  private static final int MOVABLE = 3;
  private static final int DAMAGE_CALC_MODE_OLD = 0;
  private static final int DAMAGE_CALC_MODE_NEW = 1;

  private ModelManager model;
  private CommanderLogic co;
  private MoveLogic move;
  private LifecycleLogic life;

  private Configuration cfgDaysOfPeace;
  private Configuration cfgDamageCalculation;

  @Override
  public void onConstruction() {
    cfgDaysOfPeace = new Configuration("game.daysOfPeace", 0, 50, 0);
    cfgDamageCalculation = new Configuration("game.damageCalc.mode", 0, 1, 0);
  }

  /**
   * 
   * @return a random integer which can be used for luck.
   */
  public int getBattleLuck() {
    return NumberUtil.getRandomInt(MAX_LUCK_EXCLUSIVE);
  }

  /**
   * 
   * @return true when the game is in the peace phase, else false
   */
  public boolean inPeacePhase() {
    return model.day < cfgDaysOfPeace.value;
  }

  public boolean hasMainWeapon(Unit unit) {
    return unit.type.ammo > 0;
  }

  /**
   * 
   * @param attacker
   * @return the fire type of an unit
   */
  private int getFireType(Unit attacker) {
    int minrange = attacker.type.attack.minrange;
    int maxrange = attacker.type.attack.maxrange;

    if (minrange == Constants.INACTIVE && maxrange == Constants.INACTIVE) {
      return FIRETYPE_NONE;

    } else if (minrange == 1 && maxrange == 1) {
      return FIRETYPE_DIRECT;

    } else if (minrange == 1 && maxrange > 1) {
      return FIRETYPE_BALLISTIC;

    } else if (minrange > 1 && maxrange > 1) {
      return FIRETYPE_INDIRECT;
    }

    return AssertUtil.neverReached("unknown firetype");
  }

  /**
   * A direct unit can fire and move in the same turn but has a minimum and
   * maximum range of 1 (means must stand next by an opponent to attack).
   * 
   * @param unit
   * @return
   */
  public boolean isDirect(Unit unit) {
    return getFireType(unit) == FIRETYPE_DIRECT;
  }

  /**
   * An indirect unit cannot fire and move in the same turn but has a minimum
   * range of 2 or greater.
   * 
   * @param unit
   * @return
   */
  public boolean isIndirect(Unit unit) {
    return getFireType(unit) == FIRETYPE_INDIRECT;
  }

  /**
   * A ballistic unit cannot fire and move in the same turn but has a minimum
   * range of 1.
   * 
   * @param unit
   * @return
   */
  public boolean isBallistic(Unit unit) {
    return getFireType(unit) == FIRETYPE_BALLISTIC;
  }

  /**
   * @param unit
   * @return
   */
  public boolean cannotAttack(Unit unit) {
    return getFireType(unit) == FIRETYPE_NONE;
  }

  /**
   * 
   * @param attacker
   * @param defender
   * @return true if the attacker can use it's main weapon against the defender
   *         (regardless of the positions)
   */
  public boolean canUseMainWeapon(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;
    if (attacker.ammo > 0 && NullUtil.getOrElse(attack.main_wp.$get(defender.type.ID), 0) > 0) {
      return true;
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
    if (moved && (isIndirect(unit) || isBallistic(unit))) {
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
  public boolean calculateTargets(Unit unit, int x, int y, MatrixSegment selection, boolean markRangeInSelection) {
    // FIXME @ME REFA THIS MONSTER

    boolean markInData = NullUtil.isPresent(selection);
    int teamId = unit.owner.team;
    AttackType attackSheet = unit.type.attack;
    boolean targetInRange = false;

    if (attackSheet.minrange == Constants.INACTIVE || attackSheet.maxrange == Constants.INACTIVE) {
      return false;
    }

    // a unit may does not have ammo but a weapon that needs ammo to fire
    if (!markRangeInSelection) {
      if (!cannotAttack(unit) && unit.type.ammo > 0 && unit.ammo == 0) {
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

  public void fillRangeMap(Unit unit, int x, int y, MatrixSegment selection) {
    selection.reset();

    if (isDirect(unit)) {

      // movable unit -> check attack from every movable position
      PositionData pdata = new PositionData();
      model.updatePositionData(pdata, x, y);
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

    if (attacker.ammo > 0) {
      v = attack.main_wp.$get(tType);
      if (NullUtil.isPresent(v)) {
        return v;
      }
    }

    v = attack.sec_wp.$get(tType);
    if (NullUtil.isPresent(v)) {
      return v;
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

    float AHP = Unit.healthToPoints(attacker.hp);
    float LUCK = NumberUtil.asInt((luck / 100) * 10);
    float ACO = 100;
    if (isCounter) ACO += 0;

    float def = model.grabTileByUnit(defender).type.defense;
    float DCO = 100;
    float DHP = Unit.healthToPoints(defender.hp);
    float DTR = NumberUtil.asInt(def * 100 / 100);

    int damage;
    switch (cfgDamageCalculation.value) {

      case DAMAGE_CALC_MODE_OLD:
        damage = (int) (BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10));
        break;

      case DAMAGE_CALC_MODE_NEW:
        damage = (int) (BASE * (ACO / 100 * DCO / 100) * (AHP / 10));
        break;

      default:
        damage = BASE;
        break;
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
        model.searchUnit(defender, (x, y, tbdu) -> life.destroyUnit(x, y));
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
          model.searchUnit(attacker, (x, y, tbdu) -> life.destroyUnit(x, y));
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
