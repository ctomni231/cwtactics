cwt.Unit = my.Class({

  STATIC: {

    /**
     * Signal for units that cannot attack.
     */
    FIRETYPE_NONE: 0,

    /**
     * Indirect fire type that can fire from range 2 to x.
     */
    FIRETYPE_INDIRECT: 1,

    /**
     * Direct fire type that can fire from range 1 to 1.
     */
    FIRETYPE_DIRECT: 2,

    /**
     * Ballistic fire type that can fire from range 1 to x.
     */
    FIRETYPE_BALLISTIC: 3,

    /**
     * Converts HP points to a health value.
     *
     * @example
     *    6 HP -> 60 health
     *    3 HP -> 30 health
     */
    pointsToHealth: function (pt) {
      return (pt * 10);
    },

    /**
     * Converts and returns the HP points from the health
     * value of an unit.
     *
     * @example
     *   health ->  HP
     *     69   ->   7
     *     05   ->   1
     *     50   ->   6
     *     99   ->  10
     */
    healthToPoints: function (health) {
      return parseInt(health / 10, 10) + 1;
    },

    /**
     * Gets the rest of unit health.
     */
    healthToPointsRest: function (health) {
      return health - (parseInt(health / 10) + 1);
    }

  },

  constructor: function (type) {
    this.x = 0;
    this.y = 0;
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;
    this.hidden = false;
    this.loadedIn = INACTIVE_ID;
    this.type = cwt.Database.getTileSheet(type);
    this.owner = null;

    this.resupply();
  },

  /**
   * Refills the supplies of the unit.
   */
  resupply: function () {
    this.ammo = this.type.ammo;
    this.fuel = this.type.fuel;
  },

  /**
   * Damages a unit.
   */
  takeDamage: function (damage, minRest) {
    this.hp -= damage;

    if (minRest && this.hp <= minRest) {
      this.hp = minRest;
    } else {
      if (this.hp <= 0) {
        this.destroy();
      }
    }
  },

  /**
   * Heals an unit. If the unit health will be greater than the maximum
   * health value then the difference will be added as gold to the
   * owners gold depot.
   */
  heal: function (health, diffAsGold) {
    this.hp += health;
    if (this.hp > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold === true) {
        var diff = this.hp - 99;
        this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
      }

      this.hp = 99;
    }
  },

  /**
   * De-Registers an unit object from the stock of a player. The tile, where
   * the unit is placed on, will be freed from any position information.
   */
  destroy: function () {
    var unit = model.unit_data[uid];

    model.events.clearUnitPosition(uid);

    // mark slot as unused
    unit.owner = INACTIVE_ID;

    cwt.ClientEvents.unitDestroyed(this);

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 &&
      model.unit_countUnits(unit.owner) === 0) {

      controller.update_endGameRound();
    }
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
   */
  isIndirect: function () {
    return this.getFireType() === cwt.Unit.FIRETYPE_INDIRECT;
  },

  /**
   * Returns `true` if a given unit is an ballistic firing
   * unit ( *e.g. anti-tank-gun* ) else `false`.
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
       retreatVal = model (2b).unit_convertHealthToPoints( defender )/retreatVal*100;
       if( retreatVal < 20 ){

       // retreat into a neighbor tile if possible
       retreatVal = model (2b).battle_searchTile_( defender.x,defender.y, attacker.x,attacker.y );
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
  },

  /**
   * Declines wish if two units can join each other in the current situation.
   * Transporters cannot join each other when they loaded units.
   */
  canJoin: function (targetUnit) {
    if( this.type !== targetUnit.type ) return false;
    if( targetUnit.hp >= 90 ) return false;
    return true;

    if (model.transport_hasLoads(juid) ||
      model.transport_hasLoads(jtuid) ||
      joinSource.type !== joinTarget.type ||
      joinTarget.hp >= 90
      ) return false;
  },

  /**
   * Joins two units together. If the combined health is greater than the maximum
   * health then the difference will be payed to the owners resource depot.
   */
  join: function (targetUnit) {
    assert(this.type === targetUnit.type);

    // health
    model.events.healUnit(jtuid, model.unit_convertPointsToHealth(
      model.unit_convertHealthToPoints(joinSource)), true);

    // ammo
    joinTarget.ammo += joinSource.ammo;
    if (joinTarget.ammo > joinTarget.type.ammo) joinTarget.ammo = joinTarget.type.ammo;

    // fuel
    joinTarget.fuel += joinSource.fuel;
    if (joinTarget.fuel > joinTarget.type.fuel) joinTarget.fuel = joinTarget.type.fuel;

    // TODO experience points

    // disband joining unit
    this.owner = INACTIVE_ID;
  },

  /**
   * Has a transporter unit with id tid loaded units? Returns true
   * if yes, else false.
   */
  hasLoads: function (transporter) {
    assert(model.unit_isValidUnitId(tid));

    var pid = model.unit_data[tid].owner;
    for (var i = model.unit_firstUnitId(pid),
           e = model.unit_lastUnitId(pid); i < e; i++) {

      if (i !== tid) {
        var unit = model.unit_data[i];
        if (unit !== null && unit.loadedIn === tid) return true;
      }
    }

    return false;
  },

  /**
   * Returns true if the unit with the id lid is loaded by a transporter unit
   * with id tid.
   */
  hasLoads2: function (transporter) {
    assert(model.unit_isValidUnitId(lid));
    assert(model.unit_isValidUnitId(tid));
    assert(lid !== tid);

    return model.unit_data[lid].loadedIn === tid;
  },

  /**
   * Returns true if a tranporter with id tid can load the unit with the id lid.
   * This function also calculates the resulting weight if the transporter would
   * load the unit. If the calculated weight is greater than the maxiumum loadable
   * weight false will be returned.
   */
  canLoadUnit: function (transporter, load) {
    assert(model.unit_isValidUnitId(lid));
    assert(model.unit_isValidUnitId(tid));
    assert(tid !== lid);

    var transporter = model.unit_data[tid];
    var load = model.unit_data[lid];

    assert(model.transport_isTransportUnit(tid));
    assert(load.loadedIn !== tid);

    // `loadedIn` of transporter units marks the amount of loads
    // `LOADS = (LOADIN + 1) + MAX_LOADS`
    if (transporter.loadedIn + transporter.type.maxloads + 1 === 0) return false;

    return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
  },

  /**
   * Returns true if the unit with id tid is a traensporter, else false.
   */
  isTransportUnit: function () {
    return typeof this.type.maxloads === "number";
  },

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param loid
   */
  load: function (loid) {
    assert(this.isTransportUnit());

    model.unit_data[ loid ].loadedIn = tuid;
    model.unit_data[ tuid ].loadedIn--;
  },

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param transportId
   * @param trsx
   * @param trsy
   * @param loadId
   * @param tx
   * @param ty
   */
  unload: function (transportId, trsx, trsy, loadId, tx, ty) {

    // loadId must be loaded into transportId
    assert(model.unit_data[ loadId ].loadedIn === transportId);

    // TODO: remove this later
    // trapped ?
    if (tx === -1 || ty === -1 || model.unit_posData[tx][ty]) {
      controller.stateMachine.data.breakMultiStep = true;
      return;
    }

    // remove transport link
    model.unit_data[ loadId      ].loadedIn = -1;
    model.unit_data[ transportId ].loadedIn++;

    // extract mode code id
    var moveCode;
    if (tx < trsx) moveCode = model.move_MOVE_CODES.LEFT;
    else if (tx > trsx) moveCode = model.move_MOVE_CODES.RIGHT;
    else if (ty < trsy) moveCode = model.move_MOVE_CODES.UP;
    else if (ty > trsy) moveCode = model.move_MOVE_CODES.DOWN;

    // move load out of the transporter
    controller.commandStack_localInvokement("move_clearWayCache");
    controller.commandStack_localInvokement("move_appendToWayCache", moveCode);
    controller.commandStack_localInvokement("move_moveByCache", loadId, trsx, trsy, 1);
    controller.commandStack_localInvokement("wait_invoked", loadId);
  },

  /**
   * Returns `true` if a unit id is a suicide unit. A suicide unit
   * has the ability to blow itself up with an impact.
   */
  isExploder: function () {
    return this.type.suicide !== undefined;
  },

  /**
   *
   */
  explodeSelf: function (tx, ty, range, damage, owner) {
    cwt.Gameround.map.doInRange(tx, ty, range, this.exploderDamage_, damage);
  },

  /**
   * Returns true if a transporter unit can unload one of it's loads at a given position.
   * This functions understands the given pos as possible position for the transporter.
   *
   * @param uid
   * @param x
   * @param y
   * @return {*}
   */
  canUnloadSomethingAt: function (uid, x, y) {
    var loader = model.unit_data[uid];
    var pid = loader.owner;
    var unit;

    // only transporters with loads can unload things
    // TODO: is transport could be an assertion
    if (!( model.transport_isTransportUnit(uid) &&
      model.transport_hasLoads(uid) )) {
      return false;
    }

    var i = model.unit_firstUnitId(pid);
    var e = model.unit_lastUnitId(pid);
    for (; i <= e; i++) {

      unit = model.unit_data[i];
      if (unit.owner !== INACTIVE_ID && unit.loadedIn === uid) {
        var movetp = model.data_movetypeSheets[ unit.type.movetype ];

        if (model.move_canTypeMoveTo(movetp, x - 1, y)) return;
        if (model.move_canTypeMoveTo(movetp, x + 1, y)) return;
        if (model.move_canTypeMoveTo(movetp, x, y - 1)) return;
        if (model.move_canTypeMoveTo(movetp, x, y + 1)) return;
      }
    }

    return false;
  },

  /**
   *
   */
  canBeTransfered: function () {
    if (this.hasLoads()) return false;
    return true;
  },

  /**
   *
   */
  getTransferTargets: function (pid, menu) {
    for (var i = 0, e = MAX_PLAYER; i < e; i++) {
      if (i !== pid && model.player_data[i].team !== INACTIVE_ID) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   */
  transferToPlayer: function (player) {
    var selectedUnit = model.unit_data[suid];
    var tx = selectedUnit.x;
    var ty = selectedUnit.y;
    var opid = selectedUnit.owner;

    selectedUnit.owner = INACTIVE_ID;

    // Remove vision
    if (model.player_data[tplid].team !== model.player_data[opid].team) {
      model.events.modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
    }

    var tSlot = model.unit_getFreeSlot(tplid);
    model.events.clearUnitPosition(suid);
    model.events.createUnit(tSlot, tplid, tx, ty, selectedUnit.type.ID);

    var targetUnit = model.unit_data[tSlot];
    targetUnit.hp = selectedUnit.hp;
    targetUnit.ammo = selectedUnit.ammo;
    targetUnit.fuel = selectedUnit.fuel;
    targetUnit.exp = selectedUnit.exp;
    targetUnit.type = selectedUnit.type;
    targetUnit.x = tx;
    targetUnit.y = ty;
    targetUnit.loadedIn = selectedUnit.loadedIn;
  },

  /**
   * Returns true if a given unit id represents a supplier unit.
   */
  isSupplier: function (unit) {
    return unit.type.supply;
  },

  /**
   * Returns true if a given unit id has possible supply
   * targets nearby.
   */
  hasSupplyTargetsNearby: function (supplier, x, y) {
    if (supplier.loadedIn !== INACTIVE_ID) return false;

    assert(model.map_isValidPosition(x, y));
    if (!model.supply_isSupplyUnit(uid)) return false;

    return ture;
  },

  /**
   * A supplier supplies all surrounding units that can be supplied by the supplier.
   *
   *  @example
   *
   *   cross pattern
   *
   *       x
   *     x o x
   *       x
   */
  supplyUnit: function () {
    assert(this.type.supply);

    var x = this.x;
    var y = this.y;
    var pid = this.owner;
    var i = model.unit_firstUnitId(pid);
    var e = model.unit_lastUnitId(pid);

    var unitsSupplied = false;

    // check all
    for (; i < e; i++) {
      if (!model.unit_isValidUnitId(i)) continue;

      // supply when neighbor
      if (model.unit_getDistance(sid, i) === 1) {
        model.events.supply_refillResources(i);
      }
    }
  },

  /**
   * Drains fuel. When the unit does not have enough fuel then it
   * will be removed from game and the event will be stopped.
   *
   * @param uid
   * @return {Boolean}
   */
  drainFuel: function (uid) {
    var v = this.type.dailyFuelDrain;
    if (typeof v === "number") {

      // hidden units may drain more fuel
      if (this.hidden && this.type.dailyFuelDrainHidden) {
        v = this.type.dailyFuelDrainHidden;
      }

      this.fuel -= v;

      // if fuel is empty then destroy it
      if (this.fuel <= 0) {
        model.events.destroyUnit(uid);
        return false; // break event chain because unit will be removed
      }
    }
  },

  /**
   * Returns true when the unit is a laser unit, else false.
   */
  isLaser: function () {
    return (this.type.ID === "LASER_UNIT_INV");
  },

  /**
   * Fires a laser at a given position.
   */
  fireLaser: function (x, y) {
    var prop = model.property_posMap[x][y];
    assert(prop);

    var ox = x;
    var oy = y;
    var pid = prop.owner;

    // check all tiles on the map
    for (x = 0, xe = model.map_width; x < xe; x++) {
      for (y = 0, ye = model.map_height; y < ye; y++) {

        // every tile on the cross ( same y or x coordinate ) will be damaged
        if (ox === x || oy === y) {

          var unit = model.unit_posData[x][y];
          if (unit && unit.owner !== pid) {
            model.events.damageUnit(
              model.unit_extractId(unit),
              model.unit_convertPointsToHealth(prop.type.laser.damage),
              9
            );
          }
        }

      }
    }

  },

  /**
   * Returns `true` if a given property id is a cannon property.
   */
  isCannonUnit: function (unit) {
    assert(model.unit_isValidUnitId(uid));
    var unit = model.unit_data[uid];
    return (unit.type.ID === "CANNON_UNIT_INV");
  },

  /**
   * Marks all cannon targets in a selection. The area of fire will be defined by
   * the rectangle from  `sx,sy` to `tx,ty`. The cannon is on the tile `ox,oy`
   * with a given `range`.
   */
  tryToMarkCannonTargets: function (pid, selection, ox, oy, otx, oty, sx, sy, tx, ty, range) {
    assert(model.player_isValidPid(pid));

    var tid = model.player_data[pid].team;
    var osy = sy;
    var result = false;
    for (; sx <= tx; sx++) {
      for (sy = osy; sy >= ty; sy--) {
        if (!model.map_isValidPosition(sx, sy)) continue;

        // range maybe don't match
        if ((Math.abs(sx - ox) + Math.abs(sy - oy)) > range) continue;
        if ((Math.abs(sx - otx) + Math.abs(sy - oty)) > range) continue;

        // in fog
        if (model.fog_turnOwnerData[sx][sy] <= 0) continue;

        var unit = model.unit_posData[sx][sy];
        if (unit) {
          if (unit.owner !== pid && model.player_data[unit.owner].team !== tid) {
            selection.setValueAt(sx, sy, 1);
            result = true;
          }
        }
      }
    }

    return result;
  },

  /**
   * Marks all cannon targets in a given selection model (2b).
   */
  markCannonTargets: function (uid, selection) {
    var result;
    var unit = model.unit_data[uid];
    var prop = model.property_posMap[unit.x][unit.y];
    var type = (prop.type.ID !== "PROP_INV") ? prop.type : model.bombs_grabPropTypeFromPos(unit.x, unit.y);

    // no cannon
    // if( !type.cannon ) return false;
    assert(type.cannon);

    selection.setCenter(unit.x, unit.y, INACTIVE_ID);

    var max = type.cannon.range;
    switch (type.cannon.direction) {

      case "N":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x, unit.y - max - 1,
          unit.x - unit + 1, unit.y - 1,
          unit.x + unit - 1, unit.y - max,
          max
        );
        break;

      case "E":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x + max + 1, unit.y,
          unit.x + 1, unit.y + max - 1,
          unit.x + max, unit.y - max + 1,
          max
        );
        break;

      case "W":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x - max - 1, unit.y,
          unit.x - max, unit.y + max - 1,
          unit.x - 1, unit.y - max + 1,
          max
        );
        break;

      case "S":
        result = model.bombs_tryToMarkCannonTargets(
          unit.owner,
          selection,
          unit.x, unit.y,
          unit.x, unit.y + max + 1,
          unit.x - max + 1, unit.y + max,
          unit.x + max - 1, unit.y + 1,
          max
        );
        break;
    }

    return result;
  },

  /**
   *
   */
  grabBombPropTypeFromPos: function (x, y) {
    while (true) {

      if (y + 1 < model.map_height && model.property_posMap[x][y + 1] &&
        model.property_posMap[x][y + 1].type.ID === "PROP_INV") {
        y++;
        continue;
      }

      break;
    }

    if (model.property_posMap[x][y].type.ID !== "PROP_INV") {
      return model.property_posMap[x][y].type;
    }

    while (true) {

      if (x + 1 < model.map_width && model.property_posMap[x + 1][y] &&
        model.property_posMap[x + 1][y].type.ID !== "PROP_INV") {
        return model.property_posMap[x + 1][y].type;
      }

      break;
    }

    assert(false);
  },

  fireCannon_check: function (uid, selection) {
    return (
      model.bombs_isCannon(uid) &&
        model.bombs_markCannonTargets(uid, selection)
      );
  },

  fireCannon_fillTargets: function (uid, selection) {
    model.bombs_markCannonTargets(uid, selection);
  },

  /**
   * Fires a cannon at a given position.
   */
  fireCannon_invoked: function (ox, oy, x, y) {
    var prop = model.property_posMap[x][y];
    var target = model.unit_posData[x][y];
    var type = model.bombs_grabPropTypeFromPos(ox, oy);
    model.events.damageUnit(
      model.unit_extractId(target),
      model.unit_convertPointsToHealth(type.cannon.damage),
      9
    );
  },

  /**
   * Returns the movecosts to move with a given move type on a
   * given tile type.
   */
  getMoveCosts: function (movetype, x, y) {
    assert(model.map_isValidPosition(x, y));

    var v;
    var tmp;

    // grab costs from property or  if not given from tile
    tmp = model.property_posMap[x][y];
    if (tmp) {

      // nobody can move onto an invisible property
      if (tmp.type.blocker) v = -1;
      else v = movetype.costs[tmp.type.ID];
    } else v = movetype.costs[model.map_data[x][y].ID];
    if (typeof v === "number") return v;

    // check wildcard
    v = movetype.costs["*"];
    if (typeof v === "number") return v;

    // no match then return `-1`as not move able
    return -1;
  },

  /**
   * Returns true if a movetype can move to position {x,y} else false.
   */
  canTypeMoveTo: function (movetype, x, y) {
    if (model.map_isValidPosition(x, y)) {

      if (model.move_getMoveCosts(movetype, x, y) === -1) return false;
      if (model.fog_turnOwnerData[x][y] === 0) return true;
      if (model.unit_posData[x][y] !== null) return false;

      return true;
    }
  },

  move: function (uid, x, y, noFuelConsumption) {
    var way = model.move_pathCache;
    var cX = x;
    var cY = y;
    var unit = model.unit_data[ uid ];
    var uType = unit.type;
    var mType = model.data_movetypeSheets[ uType.movetype ];
    var wayIsIllegal = false;
    var lastIndex = way.length - 1;
    var fuelUsed = 0;

    // check move way by iterate through all move codes and build the path
    //
    // 1. check the correctness of the given move code
    // 2. check all tiles to recognize trapped moves
    // 3. accumulate fuel consumption ( except `noFuelConsumption` is `true` )
    //
    for (var i = 0, e = way.length; i < e; i++) {
      if (way[i] === INACTIVE_ID) break;

      // set current position by current move code
      switch (way[i]) {

        case model.move_MOVE_CODES.UP:
          if (cY === 0) wayIsIllegal = true;
          cY--;
          break;

        case model.move_MOVE_CODES.RIGHT:
          if (cX === model.map_width - 1) wayIsIllegal = true;
          cX++;
          break;

        case model.move_MOVE_CODES.DOWN:
          if (cY === model.map_height - 1) wayIsIllegal = true;
          cY++;
          break;

        case model.move_MOVE_CODES.LEFT:
          if (cX === 0) wayIsIllegal = true;
          cX--;
          break;
      }

      // when the way contains an illegal value that isn't part of
      // `model (2b).move_MOVE_CODES` then break the move process.
      assert(!wayIsIllegal);

      // is way blocked ? (niy!)
      if (false /* && model (2b).isWayBlocked( cX, cY, unit.owner, (i === e - 1) )  */) {
        lastIndex = i - 1;

        // go back until you find a valid tile
        switch (way[i]) {
          case model.move_MOVE_CODES.UP:
            cY++;
            break;
          case model.move_MOVE_CODES.RIGHT:
            cX--;
            break;
          case model.move_MOVE_CODES.DOWN:
            cY--;
            break;
          case model.move_MOVE_CODES.LEFT:
            cX++;
            break;
        }

        // this is normally not possible, except other modules makes a fault in this case
        // the moving system could not recognize a enemy in front of the mover that causes a `trap`
        assert(lastIndex !== -1);

        break;
      }

      // calculate the used fuel to move onto the current tile
      // if `noFuelConsumption` is not `true` some actions (4) like unloading does not consume fuel
      if (noFuelConsumption !== true) fuelUsed += model.move_getMoveCosts(mType, cX, cY);
    }

    // consume fuel ( if `noFuelConsumption` is `true` then the costs will be `0` )
    unit.fuel -= fuelUsed;
    assert(unit.fuel >= 0);

    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN) SOMEWHERE
    if (unit.x >= 0 && unit.y >= 0) {

      model.events.clearUnitPosition(uid);
    }

    // do not set the new position if the position is already occupied
    // the action logic (2a) must take care of this situation
    if (model.unit_posData[cX][cY] === null) model.events.setUnitPosition(uid, cX, cY);
  },

  // -----------------------------------------------------------------------------
  //                                  PRIVATE

  /**
   *
   */
  exploderDamage_: function (x, y, damage) {
    var unit = model.unit_posData[x][y];
    if (unit) model.events.damageUnit(model.unit_extractId(unit), damage, 9);
  }
});

/*
 (function(){

 function setPos(uid,x,y){
 var unit = model (2b).unit_data[uid];

 unit.x = x;
 unit.y = y;
 model (2b).unit_posData[x][y] = unit;

 model (2b).events.modifyVisionAt( x, y, unit.owner, unit.type.vision, 1 );
 }

 // Set position
 //
 model (2b).event_on("setUnitPosition",setPos);
 model (2b).event_on("createUnit",function( slot, pid, x,y, type ){
 setPos(slot,x,y);
 });
 })();

 // Clear position.
 //
 model (2b).event_on("clearUnitPosition",function(uid){
 var unit = model (2b).unit_data[uid];
 var x    = unit.x;
 var y    = unit.y;

 model (2b).events.modifyVisionAt( x, y, unit.owner, unit.type.vision, -1 );

 model (2b).unit_posData[x][y] = null;
 unit.x = -unit.x;
 unit.y = -unit.y;
 });


 model (2b).event_on("move_flushMoveData",function( move, source ){
 controller (3).commandStack_sharedInvokement(
 "move_clearWayCache"
 );

 for (var i = 0, e = move.length; i < e; i += 6) {
 if (move[i] === INACTIVE_ID) break;
 controller (3).commandStack_sharedInvokement(
 "move_appendToWayCache",
 move[i],
 move[i + 1],
 move[i + 2],
 move[i + 3],
 move[i + 4],
 move[i + 5]
 );
 }

 controller (3).commandStack_sharedInvokement(
 "move_moveByCache",
 source.unitId,
 source.x,
 source.y,
 0
 );
 });

 model (2b).event_on("move_clearWayCache",function(){
 model (2b).move_pathCache.resetValues();
 });

 model (2b).event_on("move_appendToWayCache",function(){
 var i = 0;

 // search first free slot in the cache list
 while( model (2b).move_pathCache[i] !== INACTIVE_ID ){
 i++;
 if( i >= MAX_SELECTION_RANGE ) assert(false);
 }

 // add tiles to cache path
 var argI = 0;
 while( argI < arguments.length ){
 model (2b).move_pathCache[i] = arguments[argI];
 argI++;
 i++;

 if( i >= MAX_SELECTION_RANGE ) assert(false);
 }
 });
 */