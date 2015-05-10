package org.wolftec.cwtactics.gameold.logic;

import org.wolftec.cwtactics.game.model.GameMode;
import org.wolftec.cwtactics.gameold.EngineGlobals;
import org.wolftec.cwtactics.gameold.domain.managers.GameConfigManager;
import org.wolftec.cwtactics.gameold.domain.model.GameManager;
import org.wolftec.cwtactics.gameold.domain.model.Player;
import org.wolftec.cwtactics.gameold.domain.model.Tile;
import org.wolftec.cwtactics.gameold.domain.model.Unit;
import org.wolftec.cwtactics.gameold.domain.types.AttackType;
import org.wolftec.cwtactics.gameold.domain.types.UnitType;
import org.wolftec.wCore.container.MoveableMatrix;
import org.wolftec.wCore.core.ConvertUtility;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.core.ManagedComponent;

@Constructed
public class BattleLogic {

  @Injected
  private ObjectFinderBean objectfinder;

  @Injected
  private GameManager gameround;

  @Injected
  private LifecycleLogic lifecycle;

  @Injected
  private MoveLogic move;

  @Injected
  private CommanderLogic co;

  @Injected
  private GameConfigManager config;

  private boolean fillRangeLock = false;

  /**
   * Returns true if the unit has a main weapon, else false.
   *
   * @return
   */
  public boolean hasMainWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    return (attack != null && attack.mainWeapon != null);
  }

  /**
   * Returns true if the unit has a secondary weapon, else false.
   *
   * @return
   */
  public boolean hasSecondaryWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    return (attack != null && attack.secondaryWeapon != null);
  }

  /**
   * Returns true if a given unit is an direct unit else false.
   *
   * @return
   */
  public boolean isDirect(Unit unit) {
    return getFireType(unit) == BattleType.DIRECT;
  }

  /**
   * Returns true if a given unit is an indirect unit ( *e.g. artillery* ) else
   * false.
   *
   * @return
   */
  public boolean isIndirect(Unit unit) {
    return getFireType(unit) == BattleType.INDIRECT;
  }

  /**
   * Returns true if a given unit is an ballistic unit ( *e.g. anti-tank-gun* )
   * else false.
   *
   * @return
   */
  public boolean isBallistic(Unit unit) {
    return getFireType(unit) == BattleType.BALLISTIC;
  }

  /**
   * Returns true if an attacker can use it's main weapon against a defender.
   * The distance will not checked in case of an indirect attacker.
   *
   * @param defender
   * @return
   */
  public boolean canUseMainWeapon(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;
    if (attack.mainWeapon != null && attacker.ammo > 0) {
      Integer value = attack.mainWeapon.$get(defender.type.ID);
      if (JsUtil.notUndef(value) && value > 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the fire type of a given unit.
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
  public BattleType getFireType(Unit unit) {
    if (!hasMainWeapon(unit) && !hasSecondaryWeapon(unit)) {
      return BattleType.NONE;
    }

    int min = unit.type.attack.minrange;
    if (min == 1) {
      return BattleType.DIRECT;

    } else {
      return (min > 1 ? BattleType.INDIRECT : BattleType.BALLISTIC);
    }
  }

  /**
   * @return true when the game is in the peace phase, else false
   */
  public boolean inPeacePhase() {
    return (gameround.day < config.getConfigValue("daysOfPeace"));
  }

  /**
   * Returns true if an unit has targets in sight from a given position (x,y),
   * else false. If moved is true, then the given unit will move before attack.
   * In case of indirect units this method will return false then because
   * indirect units aren't allowed to move and attack in the same turn. The
   * method will return true when at least one target is in range, else false.
   * 
   * @param unit
   * @param x
   * @param y
   * @param moved
   * @return
   */
  public boolean hasTargets(Unit unit, int x, int y, boolean moved) {
    if (moved && isIndirect(unit)) return false;
    return calculateTargets(unit, x, y, null);
  }

  public static final int ATTACKABLE = 1;
  public static final int MOVE_AND_ATTACKABLE = 2;
  public static final int MOVABLE = 3;

  /**
   * Calculates the targets of a unit. If selection data is given, then the
   * attack targets will be marked. If markTiles is true, then data has to be
   * given too. Furthermore when markTiles is true, then every tile in range
   * will be marked. The method will return true when at least one target is in
   * range, else false or false in every case when markTiles is true.
   * 
   * @param unit
   * @param x
   * @param y
   * @param selection
   *          // TODO mark attack mode
   */
  public boolean calculateTargets(Unit unit, int x, int y, MoveableMatrix selection) {
    int teamId = unit.owner.team;
    AttackType attackSheet = unit.type.attack;
    boolean targetInRange = false;

    selection.setCenter(x, y, EngineGlobals.INACTIVE_ID);

    // no battle unit ?
    if (attackSheet == null) {
      return false;
    }

    // a unit may does not have ammo but a weapon that needs ammo to fire
    if (hasMainWeapon(unit) && !hasSecondaryWeapon(unit) && unit.type.ammo > 0 && unit.ammo == 0) {
      return false;
    }

    // extract range
    int minR = unit.type.attack.minrange;
    int maxR = unit.type.attack.maxrange;
    int lY = y - maxR;
    int hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= gameround.mapHeight) hY = gameround.mapHeight - 1;
    for (; lY <= hY; lY++) {

      int lX = x - maxR;
      int hX = x + maxR;
      if (lX < 0) lX = 0;
      if (hX >= gameround.mapWidth) hX = gameround.mapWidth - 1;
      for (; lX <= hX; lX++) {

        Tile tile = gameround.getTile(lX, lY);
        int dis = gameround.getDistance(x, y, lX, lY);
        if (dis >= minR && dis <= maxR) {

          // if markRangeInSelection is true, then mark all tiles in range
          if (selection != null) {
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
            int dmg = EngineGlobals.INACTIVE_ID;
            Unit tUnit = tile.unit;
            if (tUnit != null && tUnit.owner.team != teamId) {

              dmg = getBaseDamageAgainst(unit, tUnit, true);
              if (dmg > 0) {
                targetInRange = true;

                // if mark tile is true, then mark them in the selection map
                // else return true
                if (selection != null) {
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

  // var fillRangeDoAttackRange = {
  // unit: null,
  //
  // // Expects a filed selection map (with movable tiles) and adds the attack
  // range from every movable tile.
  // //
  // doIt: function (x, y, value, selection) {
  // exports.calculateTargets(this.unit, x, y, selection, true);
  // selection.setValue(x, y, exports.ATTACKABLE);
  // }
  // };
  //
  // var fillRangeDoMoveCheck = {
  // doIt: function (x, y, value, selection) {
  // var tile = model.mapData[x][y];
  // selection.setValue(x, y, (tile.visionTurnOwner > 0 && tile.unit ?
  // EngineGlobals.INACTIVE_ID : exports.MOVABLE));
  // }
  // }

  public void fillRangeMap(Unit unit, int x, int y, MoveableMatrix selection) {
    fillRangeLock = true;

    selection.setCenter(x, y, EngineGlobals.INACTIVE_ID);

    if (isDirect(unit)) {

      // movable unit -> check attack from every movable position
      move.fillMoveMap(x, y, unit, selection);
      selection.onAllValidPositions(0, EngineGlobals.MAX_SELECTION_RANGE, (tx, ty, tvalue) -> {
        calculateTargets(unit, x, y, selection);
        selection.setValue(x, y, ATTACKABLE);
      });
      selection.onAllValidPositions(MOVE_AND_ATTACKABLE, MOVABLE, (tx, ty, tvalue) -> {
        Tile tile = gameround.getTile(tx, ty);
        selection.setValue(x, y,
            (tile.visionTurnOwner > 0 && tile.unit != null ? EngineGlobals.INACTIVE_ID : MOVABLE));
      });

    } else {

      // non movable unit -> check attack from position {x,y}
      calculateTargets(unit, x, y, selection);
    }

    fillRangeLock = false;
  }

  /**
   * Returns the base damage value as integer of an attacker against a defender.
   * If the attacker cannot attack the defender then cwt.INACTIVE will be
   * returned. This function recognizes the ammo usage of main weapons. If the
   * attacker cannot attack with his main weapon due low ammo then only the
   * secondary weapon will be checked. If withMainWp is false (public = true)
   * then the main weapon check will be skipped.
   * 
   * @param attacker
   * @param defender
   * @param withMainWp
   * @return
   */
  public int getBaseDamageAgainst(Unit attacker, Unit defender, boolean withMainWp) {
    AttackType attack = attacker.type.attack;

    if (attack == null) {
      return EngineGlobals.INACTIVE_ID;
    }

    String tType = defender.type.ID;
    int v;

    // check main weapon
    if (withMainWp && attack.mainWeapon != null && attacker.ammo > 0) {
      v = attack.mainWeapon.$get(tType);
      if (JsUtil.notUndef(v)) {
        return v;
      }
    }

    // check secondary weapon
    if (attack.secondaryWeapon != null) {
      v = attack.secondaryWeapon.$get(tType);
      if (JsUtil.notUndef(v)) {
        return v;
      }
    }

    return EngineGlobals.INACTIVE_ID;
  }

  /**
   * Returns the battle damage as integer of an attacker against an defender
   * with a given amount of luck as integer. If withMainWp is false then the
   * main weapon usage will be skipped. If isCounter is true , then the attack
   * will be interpreted as counter attack.
   * 
   * @param attacker
   * @param defender
   * @param luck
   * @param withMainWp
   * @param isCounter
   * @return
   */
  public int getBattleDamageAgainst(Unit attacker, Unit defender, int luck, boolean withMainWp,
      boolean isCounter) {

    int BASE = getBaseDamageAgainst(attacker, defender, withMainWp);
    if (BASE == EngineGlobals.INACTIVE_ID) {
      return EngineGlobals.INACTIVE_ID;
    }

    int AHP = Unit.healthToPoints(attacker.hp);
    int LUCK = ConvertUtility.floatToInt((luck / 100) * 10);
    int ACO = 100;
    if (isCounter) {
      ACO += 0;
    }

    int defTilePos = objectfinder.findTileByUnit(defender);
    int def = gameround.getTile(objectfinder.getX(defTilePos), objectfinder.getY(defTilePos)).type.defense;
    int DCO = 100;
    int DHP = Unit.healthToPoints(defender.hp);
    int DTR = ConvertUtility.floatToInt(def * 100 / 100);

    float damage;
    if (gameround.gameMode == GameMode.ADVANCE_WARS_1
        || gameround.gameMode == GameMode.ADVANCE_WARS_2) {
      damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);

    } else {
      damage = BASE * (ACO / 100 * DCO / 100) * (AHP / 10);
    }

    return ConvertUtility.floatToInt(damage);
  }

  /**
   * Declines when the attacker does not have targets in range.
   * 
   * @param attacker
   * @param defender
   * @param attLuckRatio
   * @param defLuckRatio
   */
  public void attack(Unit attacker, Unit defender, int attLuckRatio, int defLuckRatio) {
    if (attLuckRatio < 0 || attLuckRatio > 100) {
      throw new Error("IllegalLuckValueException: attacker");
    }
    if (defLuckRatio < 0 || defLuckRatio > 100) {
      throw new Error("IllegalLuckValueException: defender");
    }

    // TODO
    // check_ firstCounter: if first counter is active then the defender
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
    int damage = getBattleDamageAgainst(attacker, defender, attLuckRatio, mainWpAttack, false);

    if (damage != EngineGlobals.INACTIVE_ID) {
      lifecycle.damageUnit(defender, damage, 0);
      if (defender.hp == 0) {
        lifecycle.destroyUnit(defender, false);
      }

      powerAtt -= Unit.healthToPoints(defender.hp);

      if (mainWpAttack) {
        attacker.ammo--;
      }

      powerAtt = ConvertUtility.floatToInt(powerAtt * 0.1 * dSheets.cost);
      co.modifyStarPower(attOwner, ConvertUtility.floatToInt(0.5 * powerAtt));
      co.modifyStarPower(defOwner, powerAtt);
    }

    // counter attack when defender survives and defender is an indirect
    // attacking unit
    if (defender.hp > 0 && !this.isIndirect(defender)) {
      mainWpAttack = this.canUseMainWeapon(defender, attacker);

      damage = getBattleDamageAgainst(defender, attacker, defLuckRatio, mainWpAttack, true);

      if (damage != -1) {
        lifecycle.damageUnit(attacker, damage, 0);
        if (attacker.hp == 0) {
          lifecycle.destroyUnit(attacker, false);
        }

        powerCounterAtt -= Unit.healthToPoints(attacker.hp);

        if (mainWpAttack) {
          defender.ammo--;
        }

        powerCounterAtt = ConvertUtility.floatToInt(powerCounterAtt * 0.1 * aSheets.cost);
        co.modifyStarPower(defOwner, ConvertUtility.floatToInt(0.5 * powerCounterAtt));
        co.modifyStarPower(attOwner, powerCounterAtt);
      }
    }
  }
}
