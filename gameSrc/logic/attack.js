/**
 *
 * @namespace
 */
cwt.Attack = {

  /**
   * Signal for units that cannot attack.
   *
   * @constant
   */
  FIRETYPE_NONE: 0,

  /**
   * Indirect fire type that can fire from range 2 to x.
   *
   * @constant
   */
  FIRETYPE_INDIRECT: 1,

  /**
   * Direct fire type that can fire from range 1 to 1.
   *
   * @constant
   */
  FIRETYPE_DIRECT: 2,

  /**
   * Ballistic fire type that can fire from range 1 to x.
   *
   * @constant
   */
  FIRETYPE_BALLISTIC: 3,

  /**
   * Calculates the targets of a battle unit. If `data` is given, then
   * the attack targets will be marked in this object.
   *
   * @param {cwt.Unit} unit
   * @param {number} x
   * @param {number} y
   * @param {cwt.SelectionMap=} data
   * @param {boolean=} markTiles
   * @return {boolean}
   */
  calculateTargets: function (unit, x, y, data, markTiles) {
    if (this.DEBUG) assert(unit instanceof cwt.Unit);
    if (this.DEBUG) assert(cwt.Map.isValidPosition(x, y));

    var markInData = (typeof data !== "undefined");
    var teamId = unit.owner.team;
    var attackSheet = unit.type.attack;

    if (markInData) data.setCenter(x, y, cwt.INACTIVE);

    // no battle unit ?
    if (typeof attackSheet === "undefined") return false;

    // a unit may does not have ammo but a weapon
    // that needs ammo to fire
    if (this.hasMainWeapon(unit) && !this.hasSecondaryWeapon(unit) &&
      unit.type.ammo > 0 &&
      unit.ammo === 0) return false;

    var minR = 1;
    var maxR = 1;

    if (unit.type.attack.minrange) {
      minR = unit.type.attack.minrange;
      maxR = unit.type.attack.maxrange;
    }

    var lX;
    var hX;
    var lY = y - maxR;
    var hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= cwt.Map.height) hY = cwt.Map.height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - maxR + disY;
      hX = x + maxR - disY;
      if (lX < 0) lX = 0;
      if (hX >= cwt.Map.width) hX = cwt.Map.width - 1;
      for (; lX <= hX; lX++) {
        var tile = cwt.Map.data[lX][lY];
        var dis = cwt.Map.getDistance(x, y, lX, lY);

        // if markTiles is true, then mark all tiles in range
        if (markTiles && dis >= minR) {
          data.setValueAt(lX, lY, 1);
          continue;
        }

        // drop tile when hidden in fog
        if (tile.visionTurnOwner === 0) continue;

        if (dis >= minR) {
          var dmg = -1;

          var tUnit = tile.unit;
          if (tUnit && tUnit.owner.team !== teamId) {

            dmg = this.getBaseDamageAgainst(unit, tUnit);
            if (dmg > 0) {

              // if mark tile is true, then mark them in the
              // selection map else return true
              if (markInData) data.setValueAt(lX, lY, dmg);
              else return true;
            }
          }

        }
      }
    }

    return false;
  },


  /**
   * Returns the fire type.
   */
  getFireType: function (unit) {
    if (!this.hasMainWeapon(unit) && !this.hasSecondaryWeapon(unit)) {
      return cwt.Unit.FIRETYPE_NONE;
    }

    // main weapon decides fire type
    if (typeof unit.type.attack.minrange === "number") {
      var min = unit.type.attack.minrange;

      // min range of 1 means ballistic weapon
      if (min === 1) {
        return this.FIRETYPE_BALLISTIC;
      } else {
        return this.FIRETYPE_INDIRECT;
      }
    } else {
      return this.FIRETYPE_DIRECT;
    }
  },

  /**
   * Returns `true` if a given unit is an indirect firing
   * unit ( *e.g. artillery* ) else `false`.
   *
   * @return {boolean}
   */
  isIndirect: function (unit) {
    return unit.getFireType() === cwt.Attack.FIRETYPE_INDIRECT;
  },

  /**
   * Returns `true` if a given unit is an ballistic firing
   * unit ( *e.g. anti-tank-gun* ) else `false`.
   *
   * @return {boolean}
   */
  isBallistic: function (unit) {
    return unit.getFireType() === cwt.Attack.FIRETYPE_BALLISTIC;
  },

  /**
   * Returns true if the unit type has a main weapon else false.
   */
  hasMainWeapon: function (unit) {
    var attack = unit.type.attack;
    return (attack && attack.main_wp);
  },

  /**
   * Returns true if the unit type has a secondary
   * weapon else false.
   */
  hasSecondaryWeapon: function (unit) {
    var attack = unit.type.attack;
    return (attack && attack.sec_wp);
  },

  /**
   * Returns true if an attacker can use it's main weapon against a
   * defender. The distance won't be checked in case of indirect units.
   */
  canUseMainWeapon: function (attacker, defender) {
    var attack = attacker.type.attack;
    var tType = defender.type.ID;
    var v;

    // check ammo and main weapon availability against the defender type
    if (this.ammo > 0 && attack.main_wp) {
      v = attack.main_wp[tType];
      if (v && v > 0) {
        return true;
      }
    }

    return false;
  },

  /**
   * Returns true if an unit has targets in sight, else false.
   */
  hasTargets: function (unit, x, y, moved) {
    if (moved && this.isIndirect(unit)) return false;

    return this.calculateTargets(unit, x, y);
  },

  /**
   * Returns the base damage of an attacker against a defender. If
   * the attacker cannot attack the defender then -1 will be returned.
   * This function recognizes the ammo usage of main weapons. If the
   * attacker cannot attack with his main weapon due low ammo then only
   * the secondary weapon will be checked.
   */
  getBaseDamageAgainst: function (attacker, defender, withMainWp) {
    var attack = attacker.type.attack;
    if (!attack) return -1;
    var tType = defender.type.ID;
    var v;

    if (typeof withMainWp === "undefined") withMainWp = true;

    // check main weapon
    if (withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined) {
      v = attack.main_wp[tType];
      if (typeof v !== "undefined") return v;
    }

    // check secondary weapon
    if (attack.sec_wp !== undefined) {
      v = attack.sec_wp[tType];
      if (typeof v !== "undefined") return v;
    }

    return -1;
  },

  /**
   * Returns the battle damage against an other unit.
   */
  getBattleDamageAgainst: function (attacker, defender, luck, withMainWp, isCounter) {
    if (typeof isCounter === "undefined") isCounter = false;

    var BASE = this.getBaseDamageAgainst(attacker, defender, withMainWp);
    if (BASE === -1) return -1;

    var AHP = cwt.Unit.healthToPoints(attacker);
    var LUCK = parseInt((luck / 100) * 10, 10);
    var ACO = 100;
    if (isCounter) ACO += 0;

    var def = cwt.Map.searchUnit(defender,this.grabUnitTile_,null).type.defense;
    var DCO = 100;
    var DHP = cwt.Unit.healthToPoints(defender);
    var DTR = parseInt(def * 100 / 100, 10);

    var damage;
    if (cwt.Gameround.gamemode <= cwt.Gameround.GAME_MODE_AW2) {
      damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);
    } else {
      damage = BASE * (ACO / 100 * DCO / 100) * (AHP / 10);
    }

    return parseInt(damage, 10);
  },

  /**
   * Declines when the attacker does not have targets in range.
   *
   * @param attId
   * @param defId
   * @param attLuckRatio
   * @param defLuckRatio
   */
  attack: function (attacker, defender, attLuckRatio, defLuckRatio) {
    if (this.DEBUG) assert(attacker instanceof cwt.Unit);
    if (this.DEBUG) assert(defender instanceof cwt.Unit);
    if (this.DEBUG) assert(attLuckRatio >= 0 && attLuckRatio <= 100);
    if (this.DEBUG) assert(defLuckRatio >= 0 && defLuckRatio <= 100);

    var indirectAttack = this.isIndirect(attacker);

    // **check firstCounter:** if first counter is active then the defender
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

    var aSheets = attacker.type;
    var dSheets = defender.type;
    var attOwner = attacker.owner;
    var defOwner = defender.owner;
    var powerAtt = cwt.Unit.healthToPoints(defender);
    var powerCounterAtt = cwt.Unit.healthToPoints(attacker);
    var mainWpAttack = this.canUseMainWeapon(attacker, defender);
    var damage = this.getBattleDamageAgainst(attacker, defender, attLuckRatio, mainWpAttack, false);

    if (damage !== -1) {
      defender.takeDamage(damage);
      if (defender.hp <= 0) {
        cwt.Map.searchUnit(defender, this.destroyAfterBattle_, null);
      }

      powerAtt -= cwt.Unit.healthToPoints(defender);

      if (mainWpAttack) attacker.ammo--;

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
          cwt.Map.searchUnit(attacker, this.destroyAfterBattle_, null);
        }

        powerCounterAtt -= cwt.Unit.healthToPoints(attacker);

        if (mainWpAttack) defender.ammo--;

        powerCounterAtt = ( parseInt(powerCounterAtt * 0.1 * aSheets.cost, 10) );
        cwt.CO.modifyStarPower(defOwner, parseInt(0.5 * powerCounterAtt, 10));
        cwt.CO.modifyStarPower(attOwner, powerCounterAtt);
      }
    }
  },

  grabUnitTile_: function (x, y) {
    return cwt.Map.data[x][y];
  },

  destroyAfterBattle_: function (x, y) {
    cwt.Lifecycle.destroyUnit(x, y, false);
  }
};