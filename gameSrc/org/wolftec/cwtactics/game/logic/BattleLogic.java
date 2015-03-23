package org.wolftec.cwtactics.game.logic;

import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.managers.GameConfigManager;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.cwtactics.game.domain.types.AttackType;

@ManagedComponent
public class BattleLogic {

  @Injected
  private GameManager gameround;

  @Injected
  private GameConfigManager config;

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

  private boolean fillRangeLock = false;

  /**
   * Returns true if the **unit** has a main weapon, else false.
   *
   * @return
   */
  public boolean hasMainWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    return (attack != null && attack.mainWeapon != null);
  }

  /**
   * Returns true if the **unit** has a secondary weapon, else false.
   *
   * @return
   */
  public boolean hasSecondaryWeapon(Unit unit) {
    AttackType attack = unit.type.attack;
    return (attack != null && attack.secondaryWeapon != null);
  }

  /**
   * Returns **true** if a given **unit** is an direct unit else **false**.
   *
   * @return
   */
  public boolean isDirect(Unit unit) {
    return getFireType(unit) == BattleType.DIRECT;
  }

  /**
   * Returns **true** if a given **unit** is an indirect unit ( *e.g. artillery*
   * ) else **false**.
   *
   * @return
   */
  public boolean isIndirect(Unit unit) {
    return getFireType(unit) == BattleType.INDIRECT;
  }

  /**
   * Returns **true** if a given **unit** is an ballistic unit ( *e.g.
   * anti-tank-gun* ) else **false**.
   *
   * @return
   */
  public boolean isBallistic(Unit unit) {
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

  public enum MarkTargetsMode {
    ATTACKABLE, MOVE_AND_ATTACKABLE, MOVABLE
  }

  /**
   * Returns **true** if an **unit** has targets in sight from a given position
   * (**x**,**y**), else **false**. If **moved** is true, then the given
   * **unit** will move before attack. In case of indirect units this method
   * will return **false** then because indirect units aren't allowed to move
   * and attack in the same turn. The method will return **true** when at least
   * one target is in range, else **false**.
   * 
   * @param unit
   * @param x
   * @param y
   * @param moved
   * @return
   */
  public boolean hasTargets(Unit unit, int x, int y, boolean moved) {
    if (moved && isIndirect(unit)) return false;
    return calculateTargets(unit, x, y);
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
   */
  public void calculateTargets(Unit unit, int x, int y, MoveableMatrix selection, boolean markRangeInSelection) {
    var markInData = (typeof selection != "undefined");
    var teamId = unit.owner.team;
    var attackSheet = unit.type.attack;
    var targetInRange = false;

    // no battle unit ?
    if (typeof attackSheet === "undefined") {
        return false;
    }

    // a unit may does not have ammo but a weapon that needs ammo to fire
    if (!markRangeInSelection) {
        if (exports.hasMainWeapon(unit) && !exports.hasSecondaryWeapon(unit) && unit.type.ammo > 0 && unit.ammo === 0) {
            return false;
        }
    }

    // extract range
    var minR = 1;
    var maxR = 1;
    if (unit.type.attack.minrange) {
        minR = unit.type.attack.minrange;
        maxR = unit.type.attack.maxrange;
    }

    var lY = y - maxR;
    var hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= model.mapHeight) hY = model.mapHeight - 1;
    for (; lY <= hY; lY++) {

        var lX = x - maxR;
        var hX = x + maxR;
        if (lX < 0) lX = 0;
        if (hX >= model.mapWidth) hX = model.mapWidth - 1;
        for (; lX <= hX; lX++) {

            var tile = model.mapData[lX][lY];
            var dis = model.getDistance(x, y, lX, lY);

            if (dis >= minR && dis <= maxR) {

                // if markRangeInSelection is true, then mark all tiles in range
                if (markRangeInSelection) {
                    var nValue = exports.ATTACKABLE;

                    switch (selection.getValue(lX, lY)) {
                        case exports.MOVABLE:
                        case exports.MOVE_AND_ATTACKABLE:
                            nValue = exports.MOVE_AND_ATTACKABLE;
                            break;
                    }

                    selection.setValue(lX, lY, nValue);
                    continue;

                } else if (tile.visionTurnOwner === 0) {
                    // drop tile when hidden in fog
                    continue;

                } else {
                    var dmg = EngineGlobals.INACTIVE_ID;

                    var tUnit = tile.unit;
                    if (tUnit && tUnit.owner.team !== teamId) {

                        dmg = exports.getBaseDamageAgainst(unit, tUnit);
                        if (dmg > 0) {
                            targetInRange = true;

                            // if mark tile is true, then mark them in the selection map else return true
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

  public void fillRangeMap (Unit unit, int x, int y, Object selection) {
    assert(!fillRangeLock, "cannot call fillRangeMap twice at the same time");
    fillRangeLock = true;

    selection.clear();

    if (exports.isDirect(unit)) {

        fillRangeDoAttackRange.unit = unit;

        // movable unit -> check attack from every movable position
        move.fillMoveMap(null, selection, x, y, unit);
        selection.onAllValidPositions(0, constants.MAX_SELECTION_RANGE, fillRangeDoMoveCheck);
        selection.onAllValidPositions(exports.MOVE_AND_ATTACKABLE, exports.MOVABLE, fillRangeDoAttackRange);

        fillRangeDoAttackRange.unit = null;

    } else {

        // non movable unit -> check attack from position {x,y}
        exports.calculateTargets(unit, x, y, selection, true);
    }

    fillRangeLock = false;
}

  /**
   * Returns the **base damage value as integer** of an **attacker** against a
   * **defender**. If the attacker cannot attack the defender then
   * **cwt.INACTIVE** will be returned. This function recognizes the ammo usage
   * of main weapons. If the attacker cannot attack with his main weapon due low
   * ammo then only the secondary weapon will be checked. If **withMainWp** is
   * false (public = true) then the main weapon check will be skipped.
   * 
   * @param attacker
   * @param defender
   * @param withMainWp
   * @return
   */
  public int getBaseDamageAgainst (Unit attacker, Unit defender, boolean withMainWp) {
    var attack = attacker.type.attack;

    if (!attack) {
        return EngineGlobals.INACTIVE_ID;
    }

    var tType = defender.type.ID;
    var v;

    if (typeof withMainWp === "undefined") {
        withMainWp = true;
    }

    // check main weapon
    if (withMainWp && typeof attack.main_wp !== "undefined" && attacker.ammo > 0) {
        v = attack.main_wp[tType];
        if (typeof v !== "undefined") {
            return v;
        }
    }

    // check secondary weapon
    if (typeof attack.sec_wp !== "undefined") {
        v = attack.sec_wp[tType];
        if (typeof v !== "undefined") {
            return v;
        }
    }

    return EngineGlobals.INACTIVE_ID;
}

  /**
   * Returns the **battle damage as integer** of an **attacker** against an
   * **defender** with a given amount of **luck** as integer. If **withMainWp**
   * is false (public = true) then the main weapon usage will be skipped. If
   * **isCounter** is true (public = false), then the attack will be interpreted
   * as counter attack.
   * 
   * @param attacker
   * @param defender
   * @param luck
   * @param withMainWp
   * @param isCounter
   * @return
   */
  public int getBattleDamageAgainst (Unit attacker, Unit defender, int luck, boolean withMainWp, boolean isCounter) {
    if (typeof isCounter == "undefined") {
        isCounter = false;
    }

    var BASE = exports.getBaseDamageAgainst(attacker, defender, withMainWp);
    if (BASE === EngineGlobals.INACTIVE_ID) {
        return EngineGlobals.INACTIVE_ID;
    }

    var AHP = model.Unit.healthToPoints(attacker);
    var LUCK = parseInt((luck / 100) * 10, 10);
    var ACO = 100;
    if (isCounter) ACO += 0;

    var def = model.grabTileByUnit(defender).type.defense;
    var DCO = 100;
    var DHP = model.Unit.healthToPoints(defender);
    var DTR = parseInt(def * 100 / 100, 10);

    var damage;
    if (model.gameMode <= model.GAME_MODE_AW2) {
        damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);
    } else {
        damage = BASE * (ACO / 100 * DCO / 100) * (AHP / 10);
    }

    return parseInt(damage, 10);
}

  /**
   * Declines when the attacker does not have targets in range.
   * 
   * @param attacker
   * @param defender
   * @param attLuckRatio
   * @param defLuckRatio
   */
  public void attack (Unit attacker, Unit defender, int attLuckRatio, int defLuckRatio) {
    if (attLuckRatio < 0 || attLuckRatio > 100) { throw new Error("IllegalLuckValueException: attacker"); }
    if (defLuckRatio < 0 || defLuckRatio > 100) { throw new Error("IllegalLuckValueException: defender"); }

    // TODO
    // **check_ firstCounter:** if first counter is active then the defender
    // attacks first. In this case swap attacker and defender.
    /*
     if (!indirectAttack && controller.scriptedValue(defender.owner, "firstCounter", 0) === 1) {
     if (!model.battle_isIndirectUnit(defId)) {
     var tmp_ = defender;
     defender = attacker;
     attacker = tmp_;
     }
     }
     */

    var indirectAttack = this.isIndirect(attacker);
    var aSheets = attacker.type;
    var dSheets = defender.type;
    var attOwner = attacker.owner;
    var defOwner = defender.owner;
    var powerAtt = model.Unit.healthToPoints(defender);
    var powerCounterAtt = model.Unit.healthToPoints(attacker);
    var mainWpAttack = this.canUseMainWeapon(attacker, defender);
    var damage = this.getBattleDamageAgainst(attacker, defender, attLuckRatio, mainWpAttack, false);

    if (damage !== cwt.INACTIVE) {
        defender.takeDamage(damage);
        if (defender.hp <= 0) {
            // TODO destroy unit
        }

        powerAtt -= cwt.UnitClass.healthToPoints(defender);

        if (mainWpAttack) {
            attacker.ammo--;
        }

        powerAtt = ( parseInt(powerAtt * 0.1 * dSheets.cost, 10) );
        cwt.CO.modifyStarPower(attOwner, parseInt(0.5 * powerAtt, 10));
        cwt.CO.modifyStarPower(defOwner, powerAtt);
    }

    // counter attack when defender survives and defender is an indirect attacking unit
    if (defender.hp > 0 && !this.isIndirect(defender)) {
        mainWpAttack = this.canUseMainWeapon(defender, attacker);

        damage = this.getBattleDamageAgainst(defender, attacker, defLuckRatio, mainWpAttack, true);

        if (damage !== -1) {
            attacker.takeDamage(damage);
            if (attacker.hp <= 0) {
                // TODO destroy unit
            }

            powerCounterAtt -= cwt.UnitClass.healthToPoints(attacker);

            if (mainWpAttack) {
                defender.ammo--;
            }

            powerCounterAtt = ( parseInt(powerCounterAtt * 0.1 * aSheets.cost, 10) );
            cwt.CO.modifyStarPower(defOwner, parseInt(0.5 * powerCounterAtt, 10));
            cwt.CO.modifyStarPower(attOwner, powerCounterAtt);
        }
    }
}
}
