package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.NumberUtil;
import org.wolftec.cwt.core.collection.MatrixSegment;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.PositionData;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.TileMap;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.AttackType;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;
import org.wolftec.cwt.model.tags.Tags;
import org.wolftec.cwt.model.tags.TagValue;

public class UnitAttackAction extends AbstractAction {

  /**
   * Maximum amount of luck for an attacker. This number will be used exclusive
   * which means variable -1 is the maximum.
   */
  private static final int MAX_LUCK_EXCLUSIVE = 11;

  private static final int ATTACKABLE = 1;
  private static final int MOVE_AND_ATTACKABLE = 2;
  private static final int MOVABLE = 3;
  private static final int DAMAGE_CALC_MODE_OLD = 0;
  private static final int DAMAGE_CALC_MODE_NEW = 1;

  private final TagValue cfgDaysOfPeace;
  private final TagValue cfgDamageCalculation;

  public UnitAttackAction(Tags cfg) {
    cfgDaysOfPeace = cfg.registerConfig("game.daysOfPeace", 0, 50, 0, 1);
    cfgDamageCalculation = cfg.registerConfig("game.damageCalc.mode", 0, 1, 0, 1);
  }

  @Override
  public String key() {
    return "attack";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
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
  private boolean calculateTargets(Unit unit, int x, int y, MatrixSegment selection, boolean markRangeInSelection) {
    // FIXME @ME REFA THIS MONSTER

    boolean markInData = NullUtil.isPresent(selection);
    int teamId = unit.owners.getOwner().team;
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

          } else if (tile.data.visionTurnOwner == 0) {
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

  public void fillRangeMap(Unit unit, int x, int y, MatrixSegment selection) {
    selection.reset();

    if (isDirect(unit)) {

      // movable unit -> check attack from every movable position
      PositionData pdata = new PositionData();
      model.updatePositionData(pdata, x, y);
      move.fillMoveMap(pdata, selection);

      selection.onAllValidPositions(0, Constants.MAX_SELECTION_RANGE, (cx, cy, cvalue) -> {
        Tile tile = model.getTile(cx, cy);
        selection.setValue(x, y, (tile.data.visionTurnOwner > 0 && NullUtil.isPresent(tile.unit) ? Constants.INACTIVE : MOVABLE));
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

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    if (model.battlefield.turns.day < cfgDaysOfPeace.value) {
      return false;
    }
    return hasTargets(controller.ui.source.unit, controller.ui.target.x, controller.ui.target.y, !controller.ui.movePath.isEmpty());
  }

  @Override
  public void prepareTargets(ModelData model, ControllerData controller) {
    calculateTargets(controller.ui.source.unit, controller.ui.target.x, controller.ui.target.y, controller.ui.targets, false);
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.actionTarget.unitId;
    controller.data.p3 = NumberUtil.getRandomInt(MAX_LUCK_EXCLUSIVE);
    controller.data.p4 = NumberUtil.getRandomInt(MAX_LUCK_EXCLUSIVE);
  }

  private int getBaseDamageAgainst(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;

    if (!NullUtil.isPresent(attack)) {
      return Constants.INACTIVE;
    }

    String tType = defender.type.ID;
    int v;

    if (attacker.supplies.ammo > 0) {
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

  private int getBattleDamageAgainst(TileMap map, Unit attacker, Unit defender, int luck, boolean isCounter) {
    int BASE = getBaseDamageAgainst(attacker, defender);
    if (BASE == Constants.INACTIVE) {
      return Constants.INACTIVE;
    }

    float AHP = Unit.healthToPoints(attacker.hp);
    float LUCK = NumberUtil.asInt((luck / 100) * 10);
    float ACO = 100;
    if (isCounter) ACO += 0;

    float def = map.grabTileByUnit(defender).type.defense;
    float DCO = 100;
    float DHP = defender.live.healthPoints();
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

  private boolean canUseMainWeapon(Unit attacker, Unit defender) {
    AttackType attack = attacker.type.attack;
    if (attacker.supplies.ammo > 0 && NullUtil.getOrElse(attack.main_wp.$get(defender.type.ID), 0) > 0) {
      return true;
    }
    return false;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    // TODO counter first ability
    Unit attacker = model.battlefield.units.getUnit(controller.data.p1);
    Unit defender = model.battlefield.units.getUnit(controller.data.p2);
    boolean indirectAttack = attacker.type.attack.isIndirect();
    int attLuckRatio = controller.data.p3;
    int defLuckRatio = controller.data.p4;

    UnitType aSheets = attacker.type;
    UnitType dSheets = defender.type;
    Player attOwner = attacker.owners.getOwner();
    Player defOwner = defender.owners.getOwner();
    int powerAtt = defender.live.healthPoints();
    int powerCounterAtt = attacker.live.healthPoints();
    boolean mainWpAttack = canUseMainWeapon(attacker, defender);
    int damage = getBattleDamageAgainst(attacker, defender, attLuckRatio, false);

    if (damage != Constants.INACTIVE) {
      defender.live.damage(damage, 0);
      if (defender.live.hp <= 0) {
        model.searchUnit(defender, (x, y, tbdu) -> life.destroyUnit(x, y));
      }

      powerAtt -= defender.live.healthPoints();

      if (mainWpAttack) {
        attacker.supplies.ammo--;
      }

      powerAtt = NumberUtil.asInt(powerAtt * 0.1 * dSheets.costs);
      co.modifyPlayerCoPower(attOwner, NumberUtil.asInt(0.5 * powerAtt));
      co.modifyPlayerCoPower(defOwner, powerAtt);
    }

    // counter attack when defender survives and defender is an indirect
    // attacking unit
    if (defender.live.hp > 0 && defender.type.attack.isDirect()) {
      mainWpAttack = canUseMainWeapon(defender, attacker);

      damage = getBattleDamageAgainst(model.battlefield.map, defender, attacker, defLuckRatio, true);

      if (damage != -1) {
        attacker.live.damage(damage, 0);
        if (attacker.live.hp <= 0) {
          model.searchUnit(attacker, (x, y, tbdu) -> life.destroyUnit(x, y));
        }

        powerCounterAtt -= Unit.healthToPoints(attacker.hp);

        if (mainWpAttack) {
          defender.supplies.ammo--;
        }

        powerCounterAtt = NumberUtil.asInt(powerCounterAtt * 0.1 * aSheets.costs);
        co.modifyPlayerCoPower(defOwner, NumberUtil.asInt(0.5 * powerCounterAtt));
        co.modifyPlayerCoPower(attOwner, powerCounterAtt);
      }
    }
  }

}
