"use strict";

cwt.Config.create("weatherMinDays",1,5,1);
cwt.Config.create("weatherRandomDays",0,5,4);
cwt.Config.create("round_dayLimit",0,999,0);
cwt.Config.create("noUnitsLeftLoose",0,1,0);
cwt.Config.create("autoSupplyAtTurnStart",0,1,1);
cwt.Config.create("unitLimit",0,cwt.Player.MAX_UNITS,0,5);
cwt.Config.create("captureLimit",0,cwt.Property.MULTITON_INSTANCES,0);
cwt.Config.create("timer_turnTimeLimit",0,60,0,1);
cwt.Config.create("timer_gameTimeLimit",0,99999,0,5);
cwt.Config.create("fogEnabled",0,1,1);
cwt.Config.create("daysOfPeace",0,50,0);
cwt.Config.create("co_getStarCost",100,50000,9000,100);
cwt.Config.create("co_getStarCostIncrease",0,50000,1800,100);
cwt.Config.create("co_getStarCostIncreaseSteps",0,50,10);
cwt.Config.create("co_enabledCoPower",0,1,1);

//
//
cwt.Lifecycle = {

  // **endGameRound()**
  //
  endGameRound: function () {

  },

  // **createUnit(num, num, cwt.Player, cwt.Property)**
  //
  createUnit: function (x, y, player, type) {
    if (player instanceof cwt.Unit || player instanceof cwt.Property) {
      player = player.owner;
    }

    if (cwt.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var tile = cwt.Map.data[x][y];

    if (cwt.DEBUG) cwt.assert(player instanceof cwt.Player);
    if (cwt.DEBUG) cwt.assert(this.hasFreeUnitSlot(player));

    var unit = this.getFreeUnitSlot();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(type);

    cwt.Fog.addUnitVision(x, y, player);

    cwt.ClientEvents.unitCreated(x, y, unit);
  },

  // **destroyUnit(number, number, boolean)**
  //
  destroyUnit: function (x, y, silent) {
    var tile = cwt.Map.data[x][y];
    if (cwt.DEBUG) cwt.assert(tile.unit);

    cwt.ClientEvents.unitDestroyed(x, y, tile.unit);

    cwt.Fog.removeUnitVision(x, y, tile.unit.owner);

    var owner = tile.unit.owner;

    // remove references
    owner.numberOfUnits--;

    if (cwt.DEBUG) cwt.assert(owner.numberOfUnits >= 0);

    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 && cwt.Unit.countUnitsOfPlayer(owner) === 0) {
      this.destroyPlayer(owner);
    }
  },

  // **destroyPlayer(cwt.Player)**
  //
  destroyPlayer: function (player) {

    // change owner of the properties of player to neutral

    // destroy all units of the player
    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      var unit = cwt.Unit.getInstance(i);
      if (unit.owner === player) {

      }
    }
  },

  /**
   *
   * @return {boolean}
   */
  hasFreeUnitSlot: function (player) {
    return player.numberOfUnits < cwt.Player.MAX_UNITS;
  },

  /**
   * Returns the index of the next free unit slot.
   *
   * @return {cwt.Unit|null}
   */
  getFreeUnitSlot: function () {
    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      var unit = cwt.Unit.getInstance(i);
      if (!unit.owner) {
        return /** @type {cwt.Unit} */ unit;
      }
    }
    return null;
  }
};

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
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

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

    // check_ ammo and main weapon availability against the defender type
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

    // check_ main weapon
    if (withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined) {
      v = attack.main_wp[tType];
      if (typeof v !== "undefined") return v;
    }

    // check_ secondary weapon
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
    if (cwt.Gameround.gameMode <= cwt.Gameround.GAME_MODE_AW2) {
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
    if (this.DEBUG) cwt.assert(attacker instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(defender instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(attLuckRatio >= 0 && attLuckRatio <= 100);
    if (this.DEBUG) cwt.assert(defLuckRatio >= 0 && defLuckRatio <= 100);

    var indirectAttack = this.isIndirect(attacker);

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

/**
 *
 * @namespace
 */
cwt.Capture = {

  // **canCapture(cwt.Unit): boolean**
  //
  // Returns true, when a unit can capture a property, else false.
  //
  canCapture: function (unit) {
    return (unit.type.captures > 0);
  },

  // **canBeCaptured(cwt.Property): boolean**
  //
  canBeCaptured: function (property) {
    return (property.type.capturePoints > 0);
  },

  // **captureProperty(cwt.Property, cwt.Unit): boolean**
  //
  // Returns true, when the capture points of the property reaches zero, else false.
  //
  captureProperty: function (property,unit) {
    if (this.DEBUG) cwt.assert(unit);

    this.points -= cwt.Property.CAPTURE_STEP;

    if (this.points <= 0) {
      this.owner = unit.owner;
      this.points = cwt.Property.CAPTURE_POINTS;
      return true;
    }

    return false;
  }
};

/**
 *
 * @namespace
 */
cwt.CO = {

  /**
   * Power level of normal CO power.
   */
  POWER_LEVEL_COP: 0,

  /**
   * Power level of normal super CO power.
   */
  POWER_LEVEL_SCOP: 1,

  /**
   * Modifies the power level of a player.
   */
  modifyStarPower: function (player, value) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);

    player.power += value;
    if (player.power < 0) player.power = 0;
  },

  /**
   * Decline activate power action on game modes that aren't AW1-3.
   * Decline activate power action when a player cannot activate the base cop level.
   * Returns `true`when a given player can activate a power level.
   *
   * @param player
   * @param powerType
   * @return {boolean}
   */
  canActivatePower: function (player,powerType) {
    if (cwt.Config.getValue("co_enabledCoPower") === 0) return false;

    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);
    if (this.DEBUG) cwt.assert(powerType >= cwt.INACTIVE && powerType <= this.POWER_LEVEL_SCOP);

    // co must be available and current power must be inactive
    if (player.coA === null || player.activePower !== cwt.INACTIVE) return false;

    var stars;
    switch (powerType) {

      case this.POWER_LEVEL_COP:
        stars = player.coA.coStars;
        break;

      case this.POWER_LEVEL_SCOP:
        if (cwt.Gameround.gameMode < cwt.Gameround.GAME_MODE_AW2) return false;
        stars = player.coA.scoStars;
        break;

      // TODO
    }

    return (player.power >= (this.getStarCost(player) * stars));
  },

  /**
   * Activates the CO power of a player.
   *
   * @param {cwt.Player} player
   * @param level
   */
  activatePower: function (player, level) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);
    if (this.DEBUG) cwt.assert(level === cwt.CO.POWER_LEVEL_COP || level === cwt.CO.POWER_LEVEL_SCOP);

    player.power = 0;
    player.activePower = level;
    player.powerUsed++;
  },

  /**
   * Deactivates the CO power of a player.
   *
   * @param {cwt.Player} player
   */
  deactivatePower: function (player) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);

    player.activePower = cwt.INACTIVE;
  },

  /**
   * Returns the cost for one CO star for a given player.
   *
   * @param {cwt.Player} player
   */
  getStarCost: function (player) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);

    var cost = cwt.Config.getValue("co_getStarCost");
    var used = player.powerUsed;

    // if usage counter is greater than max usage counter then use
    // only the maximum increase counter for calculation
    var maxUsed = cwt.Config.getValue("co_getStarCostIncreaseSteps");
    if (used > maxUsed) used = maxUsed;

    cost += used * cwt.Config.getValue("co_getStarCostIncrease");

    return cost;
  },

  /**
   * Sets the main CO of a player.
   *
   * @param {cwt.Player} player
   * @param type
   */
  setMainCo: function (player, type) {
    if (this.DEBUG) cwt.assert(player instanceof cwt.Player);

    if (type === null) {
      player.coA = null;
    } else {
      if (this.DEBUG) cwt.assert(cwt.CoSheet.isValidSheet(type));

      player.coA = type;
    }
  }
};

/**
 *
 * @namespace
 */
cwt.Explode = {

  /**
   * @private
   * @event
   */
  $defineUnitSchema: function (sheet) {
    sheet.properties.suicide = {
      type: 'object',
      properties: {
        damage: { type: 'integer', minimum: 1, maximum: 9 },
        range: { type: 'integer', minimum: 1, maximum: 5 }
      }
    };
  },

  /**
   * Returns `true` if a unit id is a suicide unit. A suicide unit
   * has the ability to blow itself up with an impact.
   *
   * @param {cwt.Unit} unit
   */
  canExplode: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return unit.type.suicide !== undefined;
  },

  /**
   * Returns the explosion damage of an exploder.
   *
   * @param unit
   * @return {number}
   */
  getExplosionDamage: function (unit) {
    return cwt.Unit.pointsToHealth(unit.type.suicide.damage);
  },

  /**
   * Returns the explosion range of an exploder.
   *
   * @param unit
   * @return {number}
   */
  getExplosionRange: function (unit) {
    return unit.type.suicide.range;
  },

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} range (x >= 1)
   * @param {number} damage (x >= 0)
   */
  doExplosion: cwt.doFunction(function(){

    /** @inner */
    function damageFn(x, y, tile, damage) {
      var unit = tile.unit;
      if (unit) {
        unit.takeDamage(damage, 9);
      }
    }

    return function (x, y, range, damage) {
      if (this.DEBUG) cwt.assert(this.canExplode(cwt.Gameround.map.data[x][y].unit));
      if (this.DEBUG) cwt.assert(range >= 1);

      cwt.Lifecycle.destroyUnit(x, y, false);
      cwt.Gameround.map.doInRange(x, y, range, damageFn, damage);
    }
  })

};

/**
 *
 * @namespace
 */
cwt.Factory = {

  /**
   * Returns `true` when the given factory object (by its `prid`) is
   * a factory, else `false`.
   *
   * @param {cwt.Property} property
   * @return {boolean}
   */
  isFactory: function (property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    return (property.type.builds !== void 0);
  },

  /**
   * Returns `true` when the given factory object is a factory
   * and can produce something technically, else `false`.
   *
   * @param {cwt.Property} property
   * @return {boolean}
   */
  canProduce: function (property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    // check_ manpower
    if (!property.owner || !property.owner.manpower) return false;

    // check_ unit limit
    var uLimit = cwt.Config.getValue("unitLimit");
    if (!uLimit) uLimit = 9999999;
    var count = model.unit_countUnits(playerId);
    if (count >= uLimit) return false;

    // slots free ?
    if (count >= MAX_UNITS_PER_PLAYER) return false;

    return true
  },

  /**
   * Constructs a unit for a player. At least one slot
   * must be free to do this.
   *
   * @param {cwt.Property} factory
   * @param {String} type
   */
  buildUnit: function (factory, type) {
    if (this.DEBUG) cwt.assert(factory instanceof cwt.Property);
    if (this.DEBUG) cwt.assert(cwt.UnitSheet.isValidSheet(type));

    var sheet = cwt.UnitSheet.sheets[type];

    factory.owner.manpower--;
    factory.owner.gold -= sheet.cost;

    if (this.DEBUG) cwt.assert(factory.owner.gold >= 0);

    cwt.Map.searchProperty(factory,cwt.Lifecycle.createUnit,cwt.Lifecycle,type);
  },

  /**
   * Generates the build menu for a given factory object (by its `prid`).
   *
   * @param {cwt.Property} factory
   * @param {cwt.Menu} menu
   * @param {boolean=} markDisabled
   * @return {boolean}
   */
  generateBuildMenu: function (factory, menu, markDisabled) {
    if (this.DEBUG) cwt.assert(factory instanceof cwt.Property);
    if (this.DEBUG) cwt.assert(menu instanceof cwt.Menu);
    if (this.DEBUG) cwt.assert(factory.owner);

    var unitTypes = cwt.UnitSheet.types;
    var bList = factory.type.builds;
    var gold = factory.owner.gold;

    for (var i = 0, e = unitTypes.length; i < e; i++) {
      var key = unitTypes[i];
      var type = cwt.UnitSheet.sheets[key];

      if (bList.indexOf(type.movetype) === -1) continue;

      // Is the tile blocked ?
      if (type.blocked) return false;

      if (type.cost <= gold || markDisabled) {
        menu.addEntry(key, (type.cost <= gold));
      }
    }
  }

};

/**
 *
 * @namespace
 */
cwt.Fog = {

  /**
   * Modifies a vision at a given position and player.
   */
  modifyVision_: function (x, y, owner, range, value) {

    // ignore neutral objects
    if (owner.team === cwt.INACTIVE) return;

    if (cwt.Config.getValue("fogEnabled") !== 1) return;

    var clientVisible = owner.clientVisible;
    var turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) return;

    var map = cwt.Map.data;
    if (range === 0) {
      if (clientVisible)    map[x][y].visionClient += value;
      if (turnOwnerVisible) map[x][y].visionTurnOwner += value;

    } else {
      var mW = cwt.Map.width;
      var mH = cwt.Map.height;
      var lX;
      var hX;
      var lY = y - range;
      var hY = y + range;

      if (lY < 0) lY = 0;
      if (hY >= mH) hY = mH - 1;
      for (; lY <= hY; lY++) {

        var disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= mW) hX = mW - 1;
        for (; lX <= hX; lX++) {

          // does the tile block vision ?
          if (map[lX][lY].type.blocksVision && cwt.Map.getDistance(x, y, lX, lY) > 1) continue;

          if (clientVisible)    map[lX][lY].visionClient += value;
          if (turnOwnerVisible) map[lX][lY].visionTurnOwner += value;
        }
      }
    }
  },

  /**
   * Completely recalculates the fog aw2.
   */
  fullRecalculation: function () {
    var x;
    var y;
    var xe = cwt.Map.width;
    var ye = cwt.Map.height;
    var fogEnabled = (cwt.Config.getValue("fogEnabled") === 1);
    var map = cwt.Map.data;

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {

        if (!fogEnabled) {
          map[x][y].visionTurnOwner = 1;
          map[x][y].visionClient = 1;
        } else {
          map[x][y].visionTurnOwner = 0;
          map[x][y].visionClient = 0;
        }
      }
    }

    // 2. add vision-object
    if (fogEnabled) {
      var vision;
      var unit;
      var tile;
      var property;

      for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {
          tile = map[x][y];

          unit = tile.unit;
          if (unit !== null) {
            vision = unit.type.vision;
            if (vision < 0) vision = 0;

            this.modifyVision_(x, y, unit.owner, vision, 1);
          }

          property = tile.property;
          if (property !== null && property.owner !== null) {
            vision = property.type.vision;
            if (vision < 0) vision = 0;

            this.modifyVision_(x, y, property.owner, vision, 1);
          }
        }
      }
    }
  },

  /**
   * Removes a vision-object from the fog map.
   */
  removeVision: function (x, y, owner, range) {
    this.modifyVision_(x, y, owner, range, +1);
  },

  removeUnitVision: function (x, y, owner) {
    var unit = cwt.Map.data[x][y].unit;
    if (!owner) owner = unit.owner;

    this.removeVision(x, y, owner, unit.type.vision);
  },

  removePropertyVision: function (x, y, owner) {
    var prop = cwt.Map.data[x][y].property;
    if (!owner) owner = prop.owner;

    this.removeVision(x, y, owner, prop.type.vision);
  },

  /**
   * Adds a vision-object from the fog map.
   */
  addVision: function (x, y, owner, range) {
    this.modifyVision_(x, y, owner, range, -1);
  },

  addUnitVision: function (x, y, owner) {
    var unit = cwt.Map.data[x][y].unit;
    if (!owner) owner = unit.owner;

    this.addVision(x, y, owner, unit.type.vision);
  },

  addPropertyVision: function (x, y, owner) {
    var prop = cwt.Map.data[x][y].property;
    if (!owner) owner = prop.owner;

    this.addVision(x, y, owner, prop.type.vision);
  }
};

/**
 *
 * @namespace
 */
cwt.Laser = {

  /**
   * Returns true when the unit is a laser unit, else false.
   *
   * @param {cwt.Unit} unit
   * @return {boolean}
   */
  isLaser: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return (unit.type.ID === "LASER_UNIT_INV");
  },

  /**
   * Fires a laser at a given position.
   *
   * @param {number} x
   * @param {number} y
   */
  fireLaser: function (x, y) {
    var map = cwt.Map.data;
    var prop = map[x][y].property;

    if (this.DEBUG) cwt.assert(prop);

    var ox = x;
    var oy = y;
    var origTeam = prop.owner.team;
    var damage = cwt.Unit.pointsToHealth(prop.type.laser.damage);

    // check_ all tiles on the map
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {

        // every tile on the cross ( same y or x coordinate ) will be damaged
        if (ox === x || oy === y) {

          var unit = map[x][y].unit;
          if (unit && unit.owner.team !== origTeam) {
            unit.takeDamage(damage,9);
          }
        }
      }
    }
  }

};

/**
 * Logic object for the join mechanic.
 *
 * @namespace
 */
cwt.Join = {

  /**
   * Declines wish if two units can join each other in the current situation.
   * Transporters cannot join each other when they loaded units.
   *
   * @param {cwt.Unit} source
   * @param {cwt.Unit} target
   */
  canJoin: function (source, target) {
    if (this.DEBUG) cwt.assert(source instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(target instanceof cwt.Unit);

    if (source.type !== target.type) return false;

    // don't increase HP to more then 10
    if (target.hp >= 90) return false;

    // do they have loads?
    if (cwt.Transport.hasLoads(source) || cwt.Transport.hasLoads(target)) return false;

    return true;
  },

  /**
   * Joins two units together. If the combined health is greater than the maximum
   * health then the difference will be payed to the owners resource depot.
   *
   * @param {cwt.Unit} source
   * @param {number} x
   * @param {number} y
   */
  join: function (source, x, y) {
    if (this.DEBUG) cwt.assert(source instanceof cwt.Unit);

    var target = cwt.Map.data[x][y].unit;
    if (this.DEBUG) cwt.assert(target instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(source.type === target.type);

    // hp
    target.heal(cwt.Unit.pointsToHealth(cwt.Unit.healthToPoints(source)), true);

    // ammo
    target.ammo += source.ammo;
    if (target.ammo > target.type.ammo) target.ammo = target.type.ammo;

    // fuel
    target.fuel += source.fuel;
    if (target.fuel > target.type.fuel) target.fuel = target.type.fuel;

    // TODO experience points

    cwt.Lifecycle.destroyUnit(x, y, true);
  }

};

/**
 *
 * @namespace
 */
cwt.Move = {

  /**
   * @constant
   */
  MOVE_CODES_UP: 0,

  /**
   * @constant
   */
  MOVE_CODES_RIGHT: 1,

  /**
   * @constant
   */
  MOVE_CODES_DOWN: 2,

  /**
   * @constant
   */
  MOVE_CODES_LEFT: 3,

  /**
   * Extracts the move code between two positions.
   */
  codeFromAtoB: function (sx, sy, tx, ty) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(sx, sy));
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(tx, ty));
    if (this.DEBUG) cwt.assert(cwt.Map.getDistance(sx, sy, tx, ty) === 1);

    if (sx < tx) {
      return this.MOVE_CODES_RIGHT;
    } else if (sx > tx) {
      return this.MOVE_CODES_LEFT;
    } else if (sy < ty) {
      return this.MOVE_CODES_DOWN;
    } else if (sy > ty) {
      return this.MOVE_CODES_UP;
    }

    return cwt.INACTIVE;
  },

  getMoveType: function (movetype) {
    return cwt.MovetypeSheet.sheets[movetype];
  },

  /**
   * Returns the move cost to move with a given move type on a given tile type.
   */
  getMoveCosts: function (movetype, x, y) {
    if (this.DEBUG) {
      cwt.assert(cwt.Map.isValidPosition(x, y));
      cwt.assert(movetype.costs !== undefined);
    }

    var v;
    var tmp = cwt.Map.data[x][y];

    // grab costs from property or  if not given from tile
    tmp = (tmp.property) ? tmp.property : tmp;
    if (tmp.type.blocker) {
      v = -1;
    } else {
      v = movetype.costs[tmp.type.ID];
    }

    if (typeof v === "number") return v;

    // check_ wildcard
    v = movetype.costs["*"];
    if (typeof v === "number") return v;

    // no match then return `-1`as not move able
    return -1;
  },

  /**
   * Returns true if a movetype can move to position {x,y} else false.
   *
   * @param movetype
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  canTypeMoveTo: function (movetype, x, y) {
    if (cwt.Map.isValidPosition(x, y)) {
      if (this.getMoveCosts(movetype, x, y) === -1) return false;


      var tile = cwt.Map.data[x][y];
      if (tile.visionTurnOwner === 0) return true;
      if (tile.unit) return false;

      return true;
    } else {
      return false;
    }
  },

  /**
   * Generates a path from a start position { `stx` , `sty` } to { `tx` , `ty` } with a given selection map. The
   * result will be stored in the `movePath`.
   *
   * @param {number} stx
   * @param {number} sty
   * @param {number} tx
   * @param {number} ty
   * @param {cwt.InterfaceSelection} selection
   * @param {cwt.CircularBuffer} movePath
   */
  generateMovePath: function (stx, sty, tx, ty, selection, movePath) {
    if (cwt.DEBUG) cwt.assert(cwt.Map.isValidPosition(stx, sty));
    if (cwt.DEBUG) cwt.assert(cwt.Map.isValidPosition(tx, ty));

    var dir;
    var cNode;

    var graph = new Graph(selection.getData());

    var dsx = stx - selection.getCenterX();
    var dsy = sty - selection.getCenterY();
    var dtx = tx - selection.getCenterX();
    var dty = ty - selection.getCenterY();

    var start = graph.nodes[dsx][dsy];
    var end = graph.nodes[dtx][dty];

    var path = astar.search(graph.nodes, start, end);

    var cx = stx;
    var cy = sty;

    movePath.clear();
    for (var i = 0, e = path.length; i < e; i++) {
      cNode = path[i];

      // extract move code
      if (cNode.x > cx) {
        dir = this.MOVE_CODES_RIGHT;
      } else if (cNode.x < cx) {
        dir = this.MOVE_CODES_LEFT;
      } else if (cNode.y > cy) {
        dir = this.MOVE_CODES_DOWN;
      } else if (cNode.y < cy) {
        dir = this.MOVE_CODES_UP;
      } else {
        cwt.assert(false);
      }

      // add code to move path
      movePath.push(dir);

      // update current position
      cx = cNode.x;
      cy = cNode.y;
    }
  },

  /**
   *
   * @param code
   * @param {cwt.CircularBuffer} movePath
   * @return {boolean}
   * @private
   */
  isGoBackCommand_: function (code, movePath) {
    var lastCode = movePath.get(movePath.size - 1);
    var goBackCode;

    // get go back code
    switch (code) {
      case this.MOVE_CODES_UP:
        goBackCode = this.MOVE_CODES_DOWN;
        break;
      case this.MOVE_CODES_DOWN:
        goBackCode = this.MOVE_CODES_UP;
        break;
      case this.MOVE_CODES_LEFT:
        goBackCode = this.MOVE_CODES_RIGHT;
        break;
      case this.MOVE_CODES_RIGHT:
        goBackCode = this.MOVE_CODES_LEFT;
        break;
    }

    // if move is a go back then pop the lest code
    if (lastCode === goBackCode) {
      movePath.popLast();
      return true;
    } else {
      return false;
    }
  },

  /**
   * Appends a move `code` to a given `movePath` and returns `true` if the
   * insertion was possible else `false`. If the new code is a backwards move
   * to the previous tile in the path then the actual last tile will be
   * dropped. In this function returns also `true` in this case.
   *
   * @param {cwt.Move.MOVE_CODES_DOWN|cwt.Move.MOVE_CODES_RIGHT|cwt.Move.MOVE_CODES_LEFT|cwt.Move.MOVE_CODES_UP} code
   * @param {cwt.CircularBuffer} movePath
   * @param {cwt.InterfaceSelection} selection
   * @param {Number} sx
   * @param {Number} sy
   */
  addCodeToMovePath: function (code, movePath, selection, sx, sy) {
    if (this.DEBUG) cwt.assert(code >= this.MOVE_CODES_UP && code <= this.MOVE_CODES_LEFT);

    if (this.isGoBackCommand_(code, movePath)) {
      return true;
    }

    var source = cwt.Map.data[sx][sy];
    var unit = source.unit;
    var points = unit.type.range;
    var fuelLeft = unit.fuel;

    // decrease move range when not enough fuel is available to move the maximum possible
    // range for the selected move type
    if (fuelLeft < points) {
      points = fuelLeft;
    }

    // add command to the move path list
    movePath.data[movePath.size] = code;

    // calculate fuel consumption for the current move path
    var cx = sx;
    var cy = sy;
    var fuelUsed = 0;
    for (var i = 0, e = movePath.size; i < e; i++) {
      switch (movePath.data[i]) {

        case this.MOVE_CODES_UP:
          cy--;
          break;

        case this.MOVE_CODES_DOWN:
          cy++;
          break;

        case this.MOVE_CODES_LEFT:
          cx--;
          break;

        case this.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      // acc. fuel consumption
      fuelUsed += selection.getValue(cx, cy);
    }

    // if to much fuel would be needed then decline
    if (fuelUsed > points) {
      movePath.data[movePath.size - 1] = cwt.INACTIVE;
      return false;
    } else {
      return true;
    }
  },

  /**
   * Little helper array object for `model.move_fillMoveMap`. This will be used
   * only by one process. If the helper is not available then a temp object will
   * be created in `model.move_fillMoveMap`. If the engine is used without client
   * hacking then this situation never happen and the `model.move_fillMoveMap`
   * will use this helper to prevent unnecessary array creation.
   *
   * @private
   */
  fillMoveMapHelper_: [],

  /**
   * @private
   */
  checker_: [
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE,
    cwt.INACTIVE
  ],

  /**
   * Fills a move map for possible move able tiles in a selectionMap map.
   *
   * @param {cwt.Position} sourcePosition
   * @param {cwt.InterfaceSelection} selectionMap
   * @param {Number} x
   * @param {Number} y
   * @param {cwt.Unit} unit
   */
  fillMoveMap: function (sourcePosition, selectionMap, x, y, unit) {
    var cost;
    var checker;
    var map = cwt.Map.data;

    // grab object aw2 from `sourcePosition` position if no explicit aw2 is given
    if (typeof x !== "number") x = sourcePosition.x;
    if (typeof y !== "number") y = sourcePosition.y;
    if (!unit) unit = sourcePosition.unit;

    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var toBeChecked;
    var releaseHelper = false;
    if (this.fillMoveMapHelper_ !== null) {

      // use the cached array
      toBeChecked = this.fillMoveMapHelper_;
      checker = this.checker_;

      // reset some stuff
      for (var n = 0, ne = toBeChecked.length; n < ne; n++) {
        toBeChecked[n] = null;
      }
      for (var n = 0, ne = checker.length; n < ne; n++) {
        checker[n] = cwt.INACTIVE;
      }

      // remove cache objects from the move logic object
      this.fillMoveMapHelper_ = null;
      this.checker_ = null;

      releaseHelper = true;

    } else {

      // use a new arrays because cache objects aren't available
      toBeChecked = [];
      checker = [
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE,
        cwt.INACTIVE
      ];
    }

    var moveTypeName = unit.type.movetype;
    var moveTypeObj = this.getMoveType(moveTypeName);
    var range = unit.type.range;
    var player = unit.owner;

    // decrease range if not enough fuel is available
    if (unit.fuel < range) {
      range = unit.fuel;
    }

    // add start tile to the map
    selectionMap.setCenter(x, y, cwt.INACTIVE);
    selectionMap.setValue(x, y, range);

    // fill map ( one structure is X;Y;LEFT_POINTS )
    toBeChecked[0] = x;
    toBeChecked[1] = y;
    toBeChecked[2] = range;

    while (true) {
      var cHigh = -1;
      var cHighIndex = -1;

      for (var i = 0, e = toBeChecked.length; i < e; i += 3) {
        var leftPoints = toBeChecked[i + 2];

        if (leftPoints !== undefined && leftPoints !== null) {
          if (cHigh === -1 || leftPoints > cHigh) {
            cHigh = leftPoints;
            cHighIndex = i;
          }
        }
      }
      if (cHighIndex === -1) break;

      var cx = toBeChecked[cHighIndex];
      var cy = toBeChecked[cHighIndex + 1];
      var cp = toBeChecked[cHighIndex + 2];

      // clear
      toBeChecked[cHighIndex] = null;
      toBeChecked[cHighIndex + 1] = null;
      toBeChecked[cHighIndex + 2] = null;

      // set neighbors for check_
      if (cx > 0) {
        checker[0] = cx - 1;
        checker[1] = cy;
      } else {
        checker[0] = -1;
        checker[1] = -1;
      }
      if (cx < cwt.Map.width - 1) {
        checker[2] = cx + 1;
        checker[3] = cy;
      } else {
        checker[2] = -1;
        checker[3] = -1;
      }
      if (cy > 0) {
        checker[4] = cx;
        checker[5] = cy - 1;
      } else {
        checker[4] = -1;
        checker[5] = -1;
      }
      if (cy < cwt.Map.height - 1) {
        checker[6] = cx;
        checker[7] = cy + 1;
      } else {
        checker[6] = -1;
        checker[7] = -1;
      }

      // check_ the given neighbors for move
      for (var n = 0; n < 8; n += 2) {
        if (checker[n] === -1) {
          continue;
        }

        var tx = checker[n];
        var ty = checker[n + 1];

        cost = this.getMoveCosts(moveTypeObj, tx, ty);
        if (cost !== -1) {

          var cTile = map[tx][ty];
          var cUnit = cTile.unit;

          if (cUnit !== null &&
            cTile.visionTurnOwner > 0 &&
            !cUnit.hidden &&
            cUnit.owner.team !== player.team) {
            continue;
          }

          var rest = cp - cost;
          if (rest >= 0 && rest > selectionMap.getValue(tx, ty)) {

            // add possible move to the `selectionMap` map
            selectionMap.setValue(tx, ty, rest);

            // add this tile to the checker
            for (var i = 0, e = toBeChecked.length; i <= e; i += 3) {
              if (toBeChecked[i] === null || i === e) {
                toBeChecked[i] = tx;
                toBeChecked[i + 1] = ty;
                toBeChecked[i + 2] = rest;
                break;
              }
            }
          }
        }
      }
    }

    // release helper if you grabbed it
    if (releaseHelper) {
      this.fillMoveMapHelper_ = toBeChecked;
      this.checker_ = checker;
    }

    // convert left points back to absolute costs
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {
        if (selectionMap.getValue(x, y) !== cwt.INACTIVE) {
          cost = this.getMoveCosts(moveTypeObj, x, y);
          selectionMap.setValue(x, y, cost);
        }
      }
    }
  },

  /**
   *
   * @param {cwt.CircularBuffer} movePath
   * @param {cwt.Position} source
   * @param {cwt.Position} target
   * @return {boolean}
   */
  trapCheck: function (movePath, source, target) {
    var cBx;
    var cBy;
    var map = cwt.Map.data;
    var cx = source.x;
    var cy = source.y;
    var teamId = source.unit.owner.team;
    for (var i = 0, e = movePath.size; i < e; i++) {
      switch (movePath.get(i)) {
        case this.MOVE_CODES_DOWN:
          cy++;
          break;

        case this.MOVE_CODES_UP:
          cy--;
          break;

        case this.MOVE_CODES_LEFT:
          cx--;
          break;

        case this.MOVE_CODES_RIGHT:
          cx++;
          break;
      }

      var unit = map[cx][cy].unit;
      if (!unit) {

        // no unit there? then it's a valid position
        cBx = cx;
        cBy = cy;

      } else if (teamId !== unit.owner.team) {
        if (this.DEBUG) cwt.assert(typeof cBx !== "number" && typeof cBy !== "number");

        target.set(cBx, cBy); // ? this looks ugly here...
        movePath.data[i] = cwt.INACTIVE;

        return true;
      }
    }

    return false;
  },

  /**
   *
   */
  movePathCache: new cwt.CircularBuffer(cwt.MAX_MOVE_LENGTH),

  /**
   *
   * @param unit
   * @param x
   * @param y
   * @param movePath
   * @param {boolean=} noFuelConsumption
   * @param {boolean=} preventRemoveOldPos
   * @param {boolean=} preventSetNewPos
   */
  move: function (unit, x, y, movePath, noFuelConsumption, preventRemoveOldPos, preventSetNewPos) {
    var map = cwt.Map.data;
    var team = unit.owner.team;

    // the unit must not be on a tile (e.g. loads), that is the reason why we
    // need a valid x,y position here as parameters
    var cX = x;
    var cY = y;

    // do not set the new position if the position is already occupied
    // the action logic must take care of this situation
    if (preventRemoveOldPos !== true) {
      cwt.Map.data[x][y].unit = null;
    }

    var uType = unit.type;
    var mType = uType.movetype;
    var lastIndex = movePath.length - 1;
    var fuelUsed = 0;

    // check_ move way by iterate through all move codes and build the path
    //
    // 1. check_ the correctness of the given move code
    // 2. check_ all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //

    var trapped = false;
    var lastX = -1;
    var lastY = -1;
    var lastFuel = 0;
    var lastIndex = 0;
    for (var i = 0, e = movePath.getLastIndex(); i < e; i++) {

      // set current position by current move code
      switch (movePath.data[i]) {

        case this.MOVE_CODES_UP:
          if (this.DEBUG) cwt.assert(cY === 0);
          cY--;
          break;

        case this.MOVE_CODES_RIGHT:
          if (this.DEBUG) cwt.assert(cX === cwt.Map.width - 1);
          cX++;
          break;

        case this.MOVE_CODES_DOWN:
          if (this.DEBUG) cwt.assert(cY === cwt.Map.height - 1);
          cY++;
          break;

        case this.MOVE_CODES_LEFT:
          if (this.DEBUG) cwt.assert(cX === 0);
          cX--;
          break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
      if (noFuelConsumption !== true) {
        fuelUsed += this.getMoveCosts(mType, cX, cY);
      }

      var tileUnit = map[cX][cY].unit;

      // movable when tile is empty or the last tile in the way while
      // the unit on the tile belongs to the movers owner
      if (!tileUnit || (tileUnit.owner === unit.owner && i === e - 1)) {
        lastX = cX;
        lastY = cY;
        lastFuel = fuelUsed;
        lastIndex = i;

        // enemy unit
      } else if (tileUnit.owner.team !== team) {
        movePath.clear(lastIndex + 1);
        trapped = true;
        break;
      }
    }

    // consume fuel except when no fuel consumption is on
    if (noFuelConsumption !== true) {
      unit.fuel -= lastFuel;
      if (this.DEBUG) cwt.assert(unit.fuel >= 0);
    }

    // sometimes we prevent to set the unit at the target position because it moves
    // into a thing at a target position (like a transporter)
    if (preventSetNewPos !== true) {
      cwt.Map.data[lastX][lastY].unit = unit;
    }

    cwt.ClientEvents.unitMoves(x, y, lastX, lastY, movePath, trapped);
  }
};

/**
 *
 * @namespace
 */
cwt.Relationship = {

  /**
   * @constant
   */
  RELATION_SAME_THING: -1,

  /**
   * @constant
   */
  RELATION_NONE: 0,

  /**
   * @constant
   */
  RELATION_OWN: 1,

  /**
   * @constant
   */
  RELATION_ALLIED: 2,

  /**
   * @constant
   */
  RELATION_TEAM: 3,

  /**
   * @constant
   */
  RELATION_ENEMY: 4,

  /**
   * @constant
   */
  RELATION_NULL: 5,

  CHECK_NORMAL: 0,

  CHECK_UNIT: 1,

  CHECK_PROPERTY: 2,

  /**
   *
   * @param {cwt.Position} left
   * @param {cwt.Position} right
   * @param {number?} checkLeft
   * @param {number?} checkRight
   * @return {number}
   */
  getRelationShipTo: function (left, right, checkLeft, checkRight) {
    var oL;
    var oR;

    if (checkLeft !== this.CHECK_PROPERTY) oL = left.unit;
    if (checkRight !== this.CHECK_PROPERTY) oR = right.unit;

    if (!oL && checkLeft !== this.CHECK_UNIT) oL = left.property;
    if (!oR && checkRight !== this.CHECK_UNIT) oR = right.property;

    if (!oL) {
      return this.RELATION_NULL;
    }

    return this.getRelationship(oL, oR);
  },

  /**
   * Returns true if there is an unit with a given relationship on a tile
   * at a given position (x,y).
   *
   * @param {*} objectA
   * @param {*} objectB
   * @return {number}
   */
  getRelationship: function (objectA, objectB) {

    // one object is null
    if (objectA === null || objectB === null) {
      return this.RELATION_NONE;
    }

    var playerA = /** @type {cwt.Player} */ (objectA instanceof cwt.Player) ? objectA : objectA.owner;
    var playerB = /** @type {cwt.Player} */ (objectB instanceof cwt.Player) ? objectB : objectB.owner;

    // one player is inactive
    if (playerA.team === -1 || playerB.team === -1) {
      return this.RELATION_NONE;
    }

    // own
    if (playerA === playerB) {
      return this.RELATION_SAME_THING;
    }

    // allied or enemy ?
    if (playerA.team === playerB.team) {
      return this.RELATION_ALLIED;
    } else {
      return this.RELATION_ENEMY;
    }
  },

  /**
   * Returns true if there is an unit with a given relationship in
   * one of the neighbour tiles at a given position (x,y).
   *
   * @example
   *       x
   *     x o x
   *       x
   */
  getRelationshipUnitNeighbours: function (player, x, y, mode) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var unit;

    // WEST
    if (x > 0) {
      unit = cwt.Map.data[x - 1][y].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // NORTH
    if (y > 0) {
      unit = cwt.Map.data[x][y - 1].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // EAST
    if (x < cwt.Map.width - 1) {
      unit = cwt.Map.data[x + 1][y].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    // SOUTH
    if (y < cwt.Map.height - 1) {
      unit = cwt.Map.data[x][y + 1].unit;
      if (unit && this.getRelationship(player, unit.owner) === mode) return true;
    }

    return false;
  }

};

/**
 * Logic for the rocket silo mechanic.
 *
 * @namespace
 */
cwt.Silo = {

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   *
   * @param property
   * @return {boolean}
   */
  isRocketSilo: function (property) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    if (!property.type.rocketsilo) return false;
    return true;
  },

  /**
   *
   * @param property
   * @param unit
   * @return {boolean}
   */
  canBeFiredBy: function (property, unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(this.isRocketSilo(property));

    if (property.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) {
      return false;
    }

    return true;
  },

  /**
   * Returns true if a property id is a rocket silo. A rocket silo
   * has the ability to fire a rocket to a position with an impact.
   *
   * @param property
   * @param unit
   * @return {boolean}
   */
  canBeFired: function (property, unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    if (this.type.rocketsilo.fireable.indexOf(unit.type.ID) === -1) return false;
    return true;
  },

  /**
   *
   * @param property
   * @param x
   * @param y
   * @return {boolean}
   */
  canBeFiredTo: function (property, x, y) {
    if (this.DEBUG) cwt.assert(property instanceof cwt.Property);

    if (!cwt.Map.isValidPosition(x, y)) return false;
  },

  /**
   * Fires a rocket to a given position (x,y) and inflicts damage to
   * all units in a range around the position.
   *
   * @param x
   * @param y
   * @param tx
   * @param ty
   * @param owner
   */
  fireSilo: function (x, y, tx, ty, owner) {
    var silo = cwt.Map.data[x][y].property;

    if (this.DEBUG) cwt.assert(silo);
    if (this.DEBUG) cwt.assert(this.isRocketSilo(silo));

    var type = silo.type;
    var targetType = cwt.PropertySheet.sheets[type.changeTo];

    cwt.ClientEvents.propertyTypeChanged(silo,silo.type,targetType);
    silo.type = targetType;

    var damage = cwt.Unit.pointsToHealth(type.rocketsilo.damage);
    var range = type.rocketsilo.range;

    cwt.Map.doInRange(tx, ty, range, this.exploderDamage_, damage);
  },

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} damage (x >= 0)
   * @private
   */
  exploderDamage_: function (x, y, tile, damage) {
    var unit = tile.unit;
    if (unit) {
      unit.takeDamage(damage, 9);
    }
  }

};

/**
 *
 * @namespace
 */
cwt.Supply = {

  // **isSupplier(cwt.Unit): bool**
  //
  // Returns true if a given unit id represents a supplier unit.
  //
  isSupplier: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return unit.type.supply;
  },

  // **canSupplyTile(cwt.Unit, num, num): bool**
  //
  canSupplyTile: function (supplier, x, y) {
    if (this.DEBUG) cwt.assert(this.isSupplier(supplier));

    if (!cwt.Map.isValidPosition(x, y)) return false;
    return (cwt.Map.data[x][y].unit !== null);
  },

  // **hasSupplyTargetsNearby(num, num): bool**
  //
  // Returns true if a given unit id has possible supply targets nearby.
  //
  hasSupplyTargetsNearby: function (x, y) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var supplier = cwt.Map.data[x][y].unit;
    return (
      this.canSupplyTile(supplier, x + 1, y),
        this.canSupplyTile(supplier, x - 1, y),
        this.canSupplyTile(supplier, x, y + 1),
        this.canSupplyTile(supplier, x, y - 1) );
  },

  resupplyTargetByPos: function (x, y) {
    var unit = cwt.Map.data[x][y];
    if (this.DEBUG) cwt.assert(unit);

    this.resupplyTarget(unit);
  },

  /**
   * Refills the supplies of the unit.
   *
   * @param {cwt.Unit} unit
   */
  resupplyTarget: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    unit.ammo = unit.type.ammo;
    unit.fuel = unit.type.fuel;
  },

  /**
   * A supplier supplies all surrounding units that can be supplied by the supplier.
   *
   * @param x
   * @param y
   */
  supplyNeighbours: function (x, y) {
    if (this.DEBUG) cwt.assert(cwt.Map.isValidPosition(x, y));

    var supplyUnit = cwt.Map.data[x][y].property;
    if (this.DEBUG) cwt.assert(this.isSupplier(supplyUnit));

    if (this.canSupplyTile(supplyUnit, x + 1, y)) this.resupplyTargetByPos(x + 1, y);
    if (this.canSupplyTile(supplyUnit, x - 1, y)) this.resupplyTargetByPos(x - 1, y);
    if (this.canSupplyTile(supplyUnit, x, y + 1)) this.resupplyTargetByPos(x, y + 1);
    if (this.canSupplyTile(supplyUnit, x, y - 1)) this.resupplyTargetByPos(x, y - 1);
  },

  /**
   * Drains fuel.
   *
   * @param {cwt.Unit} unit
   * @return {boolean}
   */
  drainFuel: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    var v = unit.type.dailyFuelDrain;
    if (typeof v === "number") {

      // hidden units may drain more fuel
      if (this.hidden && this.type.dailyFuelDrainHidden) {
        v = this.type.dailyFuelDrainHidden;
      }

      this.fuel -= v;
    }
  },

  /**
   *
   * @param property
   */
  raiseFunds: function (property) {
    if (typeof property.type.funds !== "number") return;
    property.owner.gold += property.type.funds;

    cwt.ClientEvents.goldChange(property.owner, property.type.funds);
  },

  canPropertyHeal: function (x, y) {
    var tile = cwt.Map.data[x][y];
    var prop = tile.property;
    var unit = tile.unit;
    if (prop && unit) {
      if (typeof prop.type.repairs[unit.movetype.ID] === "number") {
        return true;
      }
    }
    return false;
  },

  propertyHeal: function (x, y) {
    if (this.DEBUG) cwt.assert(this.canPropertyHeal(x, y));

    var tile = cwt.Map.data[x][y];
    var prop = tile.property;
    var unit = tile.unit;

    unit.heal( prop.type.repairs[unit.movetype.ID], true );
  }

};

/**
 *
 * @namespace
 */
cwt.Team = {

  /**
   * Different available money transfer steps.
   */
  MONEY_TRANSFER_STEPS: [
    1000,
    2500,
    5000,
    10000,
    25000,
    50000
  ],

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   */
  canTransferMoney: function (player, x, y) {
    if (player.gold < this.MONEY_TRANSFER_STEPS[0]) {
      return false;
    }

    // only transfer money on headquarters
    var property = cwt.Map.data[x][y].property;
    if (!property || !property.type.looseAfterCaptured || property.owner === player) {
      return false;
    }

    return true;
  },

  /**
   * Returns `true` when a player can transfer money
   * to a tile owner.
   *
   * @param player
   * @param menu
   */
  getTransferMoneyTargets: function (player, menu) {
    for (var i = 0, e = this.MONEY_TRANSFER_STEPS.length; i < e; i++) {
      if (player.gold >= this.MONEY_TRANSFER_STEPS[i]) {
        menu.addEntry(this.MONEY_TRANSFER_STEPS[i]);
      }
    }
  },

  /**
   * Transfers money from one player to another player.
   *
   * @param playerA
   * @param playerB
   * @param money
   */
  transferMoney: function (playerA, playerB, money) {
    playerA.gold -= money;
    playerB.gold += money;

    // the amount of gold cannot be lower 0 after the transfer
    cwt.assert(playerA.gold >= 0);

    cwt.ClientEvents.goldChange(playerA, -money, 0, 0);
    cwt.ClientEvents.goldChange(playerB, money, 0, 0);
  },

  /**
   *
   */
  canTransferUnit: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    if (cwt.Transport.hasLoads(unit)) return false;
    return true;
  },

  /**
   *
   */
  getUnitTransferTargets: function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Player.getInstance(i, true);
      if (player && player.team !== cwt.INACTIVE) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   * @param unit
   * @param player
   */
  transferUnitToPlayer: function (unit, player) {
    var origPlayer = unit.owner;

    if (this.DEBUG) cwt.assert(player.numberOfUnits < cwt.Player.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    //
    if (origPlayer.team !== player.team) {
      cwt.Map.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
  },

  /**
   *
   */
  canTransferProperty: function (property) {
    return (property.type.notTransferable !== true);
  },

  /**
   *
   */
  getPropertyTransferTargets: function (player, menu) {
    var origI = player.id;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Player.getInstance(i, true);
      if (player && player.team !== cwt.INACTIVE) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   */
  transferPropertyToPlayer: function (property, player) {
    var origPlayer = property.owner;
    property.owner = player;

    // remove vision when unit transfers to an enemy team
    //
    if (origPlayer.team !== player.team) {
      cwt.Map.searchProperty(property, this.changeVision_, null, origPlayer);
    }
  },

  /**
   *
   * @param x
   * @param y
   * @param object
   * @param oldOwner
   * @private
   */
  changeVision_: function (x, y, object, oldOwner) {
    if (object instanceof cwt.Unit) {
      cwt.Fog.removeUnitVision(x, y, oldOwner);
      cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
      cwt.Fog.removePropertyVision(x, y, oldOwner);
      cwt.Fog.addPropertyVision(x, y, object.owner);
    }
  }
};

/*
 model.event_on("transferMoney_invoked",function(){
 controller.updateSimpleTileInformation();
 });

 model.event_on("transferUnit_invoked",function( suid ){
 var unit = model.unit_data[suid];
 var x = -unit.x;
 var y = -unit.y;

 // CHECK NEW UNIT
 controller.updateUnitStatus( model.unit_extractId( model.unit_posData[x][y] ) );
 });

 */

/**
 * Logic object for the transport mechanic.
 *
 * @namespace
 */
cwt.Transport = {

  /**
   * Returns true if the unit with id tid is a traensporter, else false.
   *
   * @param {cwt.Unit} unit
   */
  isTransportUnit: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    return (typeof unit.type.maxloads === "number");
  },

  /**
   * Has a transporter unit with id tid loaded units? Returns true
   * if yes, else false.
   *
   * @param {cwt.Unit} unit
   */
  hasLoads: function (unit) {
    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      var cUnit = cwt.Unit.getInstance(i,true);
      if (cUnit && unit.loadedIn === cUnit) return true;
    }

    return false;
  },

  /**
   * Returns true if a transporter with id tid can load the unit with the id lid.
   * This function also calculates the resulting weight if the transporter would
   * load the unit. If the calculated weight is greater than the maximum loadable
   * weight false will be returned.
   *
   * @param {cwt.Unit} transporter
   * @param {cwt.Unit} load
   */
  canLoadUnit: function (transporter, load) {
    if (this.DEBUG) cwt.assert(transporter instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(load instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(load !== transporter);
    if (this.DEBUG) cwt.assert(this.isTransportUnit(transporter));
    if (this.DEBUG) cwt.assert(load.loadedIn !== transporter);

    return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
  },

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param {cwt.Unit} transporter
   * @param {cwt.Unit} load
   */
  load: function (transporter, load) {
    if (this.DEBUG) cwt.assert(transporter instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(load instanceof cwt.Unit);
    if (this.DEBUG) cwt.assert(this.isTransportUnit(transporter));

    load.loadedIn = transporter;
  },

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param {cwt.Unit} transport
   * @param {number} trsx
   * @param {number} trsy
   * @param {cwt.Unit} load
   * @param {number} tx
   * @param {number} ty
   */
  unload: function (transport, trsx, trsy, load, tx, ty) {
    if (this.DEBUG) cwt.assert(load.loadedIn === transport);

    // TODO: remove this later
    // trapped ?
    if (tx === -1 || ty === -1 || cwt.Map.data[tx][ty].unit) {
      controller.stateMachine.data.breakMultiStep = true;
      return;
    }

    // remove transport link
    load.loadedIn = null;

    // extract mode code id
    var moveCode;
    if (tx < trsx) moveCode = cwt.Move.MOVE_CODES_LEFT;
    else if (tx > trsx) moveCode = cwt.Move.MOVE_CODES_RIGHT;
    else if (ty < trsy) moveCode = cwt.Move.MOVE_CODES_UP;
    else if (ty > trsy) moveCode = cwt.Move.MOVE_CODES_DOWN;

    // move load out of the transporter
    cwt.Move.movePathCache.clear();
    cwt.Move.movePathCache.push(moveCode);
    cwt.Move.move(unit, trsx, trsy, cwt.Move.movePathCache, true, true, false);

    transport.canAct = false;
    load.canAct = false;
  },


  /**
   * Returns true if a transporter unit can unload one of it's loads at a given position.
   * This functions understands the given pos as possible position for the transporter.
   *
   * @param {cwt.Unit} transporter
   * @param x
   * @param y
   * @return {*}
   */
  canUnloadSomethingAt: function (transporter, x, y) {
    var pid = transporter.owner;
    var unit;

    if (this.DEBUG) cwt.assert(this.isTransportUnit(transporter));

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i <= e; i++) {

      unit = cwt.Unit.getInstance(i,true);
      if (unit && unit.owner !== cwt.INACTIVE && unit.loadedIn === transporter) {
        var moveType = unit.type.movetype;

        if (cwt.Move.canTypeMoveTo(moveType, x - 1, y)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x + 1, y)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x, y - 1)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x, y + 1)) return true;
      }
    }

    return false;
  }

};

/**
 *
 * @namespace
 */
cwt.Turn = {

  // **next()**
  //
  // Ends the turn for the current active turn owner.
  //
  next: function () {
    var pid = cwt.Gameround.turnOwner.id;
    var oid = pid;

    // Try to find next player from the player pool
    pid++;
    while (pid !== oid) {

      if (pid === cwt.Player.MULTITON_INSTANCES) {
        pid = 0;

        // Next day
        cwt.Gameround.day++;
        cwt.Gameround.weatherLeftDays--;

        var round_dayLimit = cwt.Config.getValue("round_dayLimit");
        if (round_dayLimit > 0 && this.day >= round_dayLimit) {
          cwt.Lifecycle.endGameRound();
        }
      }

      // Found next player
      if (cwt.Player.getInstance(pid).team !== cwt.INACTIVE) break;

      // Try next player
      pid++;
    }

    // If the new player id is the same as the old
    // player id then the game data is corrupted
    if (this.DEBUG) cwt.assert(pid !== oid);

    // Do end/start turn logic
    this.endsTurn_(cwt.Player.getInstance(oid));
    this.startsTurn_(cwt.Player.getInstance(pid));

    cwt.ClientEvents.turnChange();
  },

  // **endsTurn_(cwt.Player) (private)**
  //
  endsTurn_: function (player) {
  },

  // **startsTurn_(cwt.Player) (private)**
  //
  startsTurn_: function (player) {

    // Sets the new turn owner and also the client, if necessary
    cwt.Gameround.turnOwner = player;

    if (player.clientControlled) {
      cwt.Player.activeClientPlayer = player;
    }

    // the active client can see what his and all allied objects can see
    var clTid = cwt.Player.activeClientPlayer.team;
    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      var cPlayer = cwt.Player.getInstance(i);

      cPlayer.turnOwnerVisible = false;
      cPlayer.clientVisible = false;

      // player isn't registered
      if (cPlayer.team === cwt.INACTIVE) continue;

      if (cPlayer.team === clTid) cPlayer.clientVisible = true;
      if (cPlayer.team === player.team) cPlayer.turnOwnerVisible = true;
    }

    var cUnit, cProp;

    cwt.Fog.fullRecalculation();

    // *******************************************************

    for (i = 0, e = cwt.Property.MULTITON_INSTANCES; i < e; i++) {
      cProp = cwt.Property.getInstance(i, true);
      if (!cProp || cProp.owner !== player) continue;

      cwt.Supply.raiseFunds(cProp);
    }

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      cUnit = /** @type {cwt.Unit} */ cwt.Unit.getInstance(i, true);
      if (!cUnit || cUnit.owner !== player) continue;

      cUnit.canAct = true;
      cwt.Supply.drainFuel(cUnit);
    }

    // *******************************************************

    var turnStartSupply = (cwt.Config.getValue("autoSupplyAtTurnStart") === 1);

    var map = cwt.Map.data;
    for (var x = 0, xe = cwt.Map.width; x < xe; x++) {
      for (var y = 0, ye = cwt.Map.height; y < ye; y++) {
        cUnit = map[x][y].unit;
        if (cUnit && cUnit.owner === player) {

          // supply units
          if (turnStartSupply && cwt.Supply.isSupplier(cUnit)) {
            cwt.supplyNeighbours(x, y);
          }

          // heal by property
          if (map[x][y].property && map[x][y].property.owner === player && cwt.Supply.canPropertyHeal(x, y)) {
            cwt.Supply.propertyHeal(x, y);
          }

          // unit is out of fuel
          if (cUnit.fuel <= 0) {
            cwt.Lifecycle.destroyUnit(x, y, false);
          }
        }
      }
    }

    // Do host only actions
    if (cwt.Network.isHost()) {

      // Generate new weather
      if (cwt.Gameround.weatherLeftDays === 0) {
        cwt.Weather.calculateNextWeather();
      }

      // Do AI-Turn
      // TODO
      /*
       if (controller.network_isHost() && !controller.ai_isHuman(pid)) {
       controller.ai_machine.event("tick");
       }
       */
    }
  }

};

/**
 * Weather logic module.
 *
 * @namespace
 */
cwt.Weather = {

  /**
   * Calculates the next weather and adds the result as timed event to
   * the day events. **Only invokable by the host instance.**
   */
  calculateNextWeather: function () {

    // this event is only host invokable
    cwt.assert(cwt.Network.isHost());

    // Search a random weather if the last weather
    // was `null` or the default weather type
    var newTp;
    var duration;
    if (cwt.Gameround.weather && cwt.Gameround.weather.defaultWeather) {

      var list = cwt.WeatherSheet.types;
      newTp = cwt.selectRandomListElement(list, cwt.Gameround.weather);
      duration = 1;

    } else {

      // Take default weather and calculate a random amount of days
      newTp = cwt.WeatherSheet.defaultWeather;
      duration = cwt.Config.getValue("weatherMinDays") +
        parseInt(cwt.Config.getValue("weatherRandomDays") * Math.random(), 10);
    }

    cwt.Gameround.weatherLeftDays = duration;
    this.changeWeather(newTp); // TODO: send message here
  },

  /**
   *
   */
  changeWeather: function (weather) {
    if (this.DEBUG) cwt.assert(cwt.WeatherSheet.isValidSheet(weather));

    cwt.Gameround.weather = weather;

    // recalculate fog map for client and turn
    // owner due possible weather effects
    cwt.Fog.fullRecalculation();
  }
};