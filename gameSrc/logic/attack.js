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
   */
  calculateTargets: function (uid, x, y, data, markAttackableTiles) {
    var markInData = (typeof data !== "undefined");
    if (!markAttackableTiles) markAttackableTiles = false;

    assert(model.unit_isValidUnitId(uid));
    if (markInData) data.setCenter(x, y, INACTIVE_ID);

    var unit = model.unit_data[uid];
    var teamId = model.player_data[unit.owner].team;
    var attackSheet = unit.type.attack;

    if (arguments.length === 1) {
      x = unit.x;
      y = unit.y;
    }

    if (DEBUG) util.log("calculate targets for unit id", uid, "at", x, ",", y);

    assert(model.map_isValidPosition(x, y));
    if (arguments.length === 3) assert(util.isBoolean(markAttackableTiles));

    // NO BATTLE UNIT ?
    if (typeof attackSheet === "undefined") return false;

    // ONLY MAIN WEAPON WITHOUT AMMO ?
    if (model.battle_hasMainWeapon(unit.type) && !model.battle_hasSecondaryWeapon(unit.type) &&
      unit.type.ammo > 0 && unit.ammo === 0) return false;

    var minR = 1;
    var maxR = 1;

    if (unit.type.attack.minrange) {

      controller.prepareTags(x, y, uid);
      minR = controller.scriptedValue(unit.owner, "minrange", unit.type.attack.minrange);
      maxR = controller.scriptedValue(unit.owner, "maxrange", unit.type.attack.maxrange);
    }

    var lX;
    var hX;
    var lY = y - maxR;
    var hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= model.map_height) hY = model.map_height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - maxR + disY;
      hX = x + maxR - disY;
      if (lX < 0) lX = 0;
      if (hX >= model.map_width) hX = model.map_width - 1;
      for (; lX <= hX; lX++) {

        if (markAttackableTiles) {
          if (model.map_getDistance(x, y, lX, lY) >= minR) {

            // SYMBOLIC YES YOU CAN ATTACK THIS TILE
            data.setValueAt(lX, lY, 1);
          }
        } else {

          // IN FOG ?
          if (model.fog_turnOwnerData[lX][lY] === 0) continue;

          if (model.map_getDistance(x, y, lX, lY) >= minR) {

            var dmg = -1;

            // ONLY UNIT FROM OTHER TEAMS ARE ATTACK ABLE
            var tUnit = model.unit_posData[lX][lY];
            if (tUnit !== null && model.player_data[tUnit.owner].team !== teamId) {
              dmg = model.battle_getBaseDamageAgainst(unit, tUnit);
              if (dmg > 0) {

                // IF DATA MODE IS ON, THEN MARK THE POSITION
                // ELSE RETURN TRUE
                if (markInData) data.setValueAt(lX, lY, dmg);
                else return true;
              }
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
  getFireType: function () {
    if (!this.hasMainWeapon() && !this.hasSecondaryWeapon()) {
      return cwt.Unit.FIRETYPE_NONE;
    }

    // main weapon decides fire type
    if (typeof this.type.attack.minrange === "number") {
      var min = this.type.attack.minrange;

      // min range of 1 means ballistic weapon
      if (min === 1) {
        return cwt.Unit.FIRETYPE_BALLISTIC;
      } else {
        return cwt.Unit.FIRETYPE_INDIRECT;
      }
    } else {
      return cwt.Unit.FIRETYPE_DIRECT;
    }
  },

  /**
   * Returns `true` if a given unit is an indirect firing
   * unit ( *e.g. artillery* ) else `false`.
   *
   * @return {boolean}
   */
  isIndirect: function () {
    return this.getFireType() === cwt.Unit.FIRETYPE_INDIRECT;
  },

  /**
   * Returns `true` if a given unit is an ballistic firing
   * unit ( *e.g. anti-tank-gun* ) else `false`.
   *
   * @return {boolean}
   */
  isBallistic: function () {
    return this.getFireType() === cwt.Unit.FIRETYPE_BALLISTIC;
  },

  /**
   * Returns true if the unit type has a main weapon else false.
   */
  hasMainWeapon: function () {
    var attack = this.type.attack;
    return (attack && attack.main_wp);
  },

  /**
   * Returns true if the unit type has a secondary
   * weapon else false.
   */
  hasSecondaryWeapon: function () {
    var attack = this.type.attack;
    return (attack && attack.sec_wp);
  },

  /**
   * Returns true if an attacker can use it's main weapon against a
   * defender. The distance won't be checked in case of indirect units.
   */
  canUseMainWeapon: function (defender) {
    var attack = this.type.attack;
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
  hasTargets: function (uid, x, y) {
    return cwt.Attack.battle_calculateTargets(uid, x, y);
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
  getBattleDamageAgainst: function (attacker, defender, luck, withMainWp, isCounter, ax, ay) {
    if (arguments.length < 7) {
      ax = attacker.x;
      ay = attacker.y;
    }

    if (DEBUG) util.log(
      "calculating battle damage",
      model.unit_extractId(attacker),
      "against",
      model.unit_extractId(defender)
    );

    if (typeof isCounter === "undefined") isCounter = false;

    assert(util.intRange(luck, 0, 100));
    assert(util.isBoolean(withMainWp));
    assert(util.isBoolean(isCounter));

    var BASE = model.battle_getBaseDamageAgainst(attacker, defender, withMainWp);
    if (BASE === -1) return -1;

    var AHP = model.unit_convertHealthToPoints(attacker);
    var DHP = model.unit_convertHealthToPoints(defender);

    // attacker values
    controller.prepareTags(
      ax, ay, model.unit_extractId(attacker),
      defender.x, defender.y, model.unit_extractId(defender)
    );

    var LUCK = parseInt((luck / 100) * controller.scriptedValue(attacker.owner, "luck", 10), 10);
    var ACO = controller.scriptedValue(attacker.owner, "att", 100);
    if (isCounter) ACO += controller.scriptedValue(defender.owner, "counteratt", 0);

    // defender values
    controller.prepareTags(defender.x, defender.y);
    var DCO = controller.scriptedValue(defender.owner, "def", 100);

    var def = model.map_data[defender.x][defender.y].defense;
    var DTR = parseInt(
      controller.scriptedValue(defender.owner, "terrainDefense", def) *
        controller.scriptedValue(defender.owner, "terrainDefenseModifier", 100) /
        100,
      10
    );

    /*
     AW1-3

     D=Damage (as shown onscreen)
     b=base damage
     o=offense (total)
     d=defense (total)
     h=HP of attacker

     Decimals are rounded down. Please note that AWDS and AWDoR use
     different values for defense (less than 1 and greater than 1, respectively).
     */
    // **Formular:** `D=b*[o-(o*d)]*(h/10)`
    var damage = BASE * (ACO / 100 - (ACO / 100 * (DCO - 100) / 100)) * (AHP / 10);

    /*
     AWDOR

     D=Damage (as shown onscreen)
     b=base damage
     o=offense (total)
     d=defense (total)
     h=HP of attacker

     Decimals are rounded down. Please note that AWDS and AWDoR use
     different values for defense (less than 1 and greater than 1, respectively).

     **Formular:** `D=b*(o/d)*(h/10)`
     var damage = BASE*(ACO/100*DCO/100)*(AHP/10)
     */

    // **Formular:** `D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]`
    //var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );

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
  attack: function (attId, defId, attLuckRatio, defLuckRatio) {
    assert(model.unit_isValidUnitId(attId));
    assert(model.unit_isValidUnitId(defId));
    assertIntRange(attLuckRatio, 0, 100);
    assertIntRange(defLuckRatio, 0, 100);

    var attacker = model.unit_data[attId];
    var defender = model.unit_data[defId];
    var indirectAttack = model.battle_isIndirectUnit(attId);

    // **check firstCounter:** if first counter is active then the defender
    // attacks first. In this case swap attacker and defender.
    if (!indirectAttack && controller.scriptedValue(defender.owner, "firstCounter", 0) === 1) {
      if (!model.battle_isIndirectUnit(defId)) {
        var tmp_ = defender;
        defender = attacker;
        attacker = tmp_;
      }
    }

    var aSheets = attacker.type;
    var dSheets = defender.type;
    var attOwner = attacker.owner;
    var defOwner = defender.owner;
    var powerAtt = model.unit_convertHealthToPoints(defender);
    var powerCounterAtt = model.unit_convertHealthToPoints(attacker);
    var damage;
    var retreatVal = powerAtt;

    // main attack
    var mainWpAttack = model.battle_canUseMainWeapon(attacker, defender);
    damage = model.battle_getBattleDamageAgainst(attacker, defender, attLuckRatio, mainWpAttack, false);

    if (damage !== -1) {
      model.events.damageUnit(defId, damage);

      powerAtt -= model.unit_convertHealthToPoints(defender);

      if (mainWpAttack) attacker.ammo--;

      powerAtt = ( parseInt(powerAtt * 0.1 * dSheets.cost, 10) );
      model.events.co_modifyPowerLevel(attOwner, parseInt(0.5 * powerAtt, 10));
      model.events.co_modifyPowerLevel(defOwner, powerAtt);

      /*
       retreatVal = model.unit_convertHealthToPoints( defender )/retreatVal*100;
       if( retreatVal < 20 ){

       // retreat into a neighbor tile if possible
       retreatVal = model.battle_searchTile_( defender.x,defender.y, attacker.x,attacker.y );
       }
       else retreatVal = false;
       */
    }

    // counter attack when defender survives and defender is an indirect
    // attacking unit
    if (/* retreatVal && */ defender.hp > 0 && !model.battle_isIndirectUnit(defId)) {
      mainWpAttack = model.battle_canUseMainWeapon(defender, attacker);

      damage = model.battle_getBattleDamageAgainst(
        defender,
        attacker,
        defLuckRatio,
        mainWpAttack,
        true
      );

      if (damage !== -1) {
        model.events.damageUnit(attId, damage);

        powerCounterAtt -= model.unit_convertHealthToPoints(attacker);

        if (mainWpAttack) defender.ammo--;

        powerCounterAtt = ( parseInt(powerCounterAtt * 0.1 * aSheets.cost, 10) );
        model.events.co_modifyPowerLevel(defOwner, parseInt(0.5 * powerCounterAtt, 10));
        model.events.co_modifyPowerLevel(attOwner, powerCounterAtt);
      }
    }
  }
};