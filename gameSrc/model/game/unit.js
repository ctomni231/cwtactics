/**
 *
 * @class
 * @extends cwt.Multiton
 */
cwt.Unit = my.Class(cwt.Multiton,{

  STATIC: {

    MULTITON_INSTANCES: MAX_UNITS_PER_PLAYER*MAX_PLAYER,

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

  constructor: function () {
    this.x = 0;
    this.y = 0;
    this.hp = 99;
    this.ammo = 0;
    this.fuel = 0;
    this.hidden = false;
    this.loadedIn = INACTIVE_ID;

    this.type = null;

    /**
     * If the value is null then unit does not exists on the map.
     *
     * @type {cwt.Player}
     */
    this.owner = null;
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

    unit.owner = null;

    cwt.ClientEvents.unitDestroyed(this);

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 &&
      model.unit_countUnits(unit.owner) === 0) {

      controller.update_endGameRound();
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
   * Marks all cannon targets in a given selection model.
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
  }
});

/*
 (function(){

 function setPos(uid,x,y){
 var unit = model.unit_data[uid];

 unit.x = x;
 unit.y = y;
 model.unit_posData[x][y] = unit;

 model.events.modifyVisionAt( x, y, unit.owner, unit.type.vision, 1 );
 }

 // Set position
 //
 model.event_on("setUnitPosition",setPos);
 model.event_on("createUnit",function( slot, pid, x,y, type ){
 setPos(slot,x,y);
 });
 })();

 // Clear position.
 //
 model.event_on("clearUnitPosition",function(uid){
 var unit = model.unit_data[uid];
 var x    = unit.x;
 var y    = unit.y;

 model.events.modifyVisionAt( x, y, unit.owner, unit.type.vision, -1 );

 model.unit_posData[x][y] = null;
 unit.x = -unit.x;
 unit.y = -unit.y;
 });


 model.event_on("move_flushMoveData",function( move, source ){
 controller.commandStack_sharedInvokement(
 "move_clearWayCache"
 );

 for (var i = 0, e = move.length; i < e; i += 6) {
 if (move[i] === INACTIVE_ID) break;
 controller.commandStack_sharedInvokement(
 "move_appendToWayCache",
 move[i],
 move[i + 1],
 move[i + 2],
 move[i + 3],
 move[i + 4],
 move[i + 5]
 );
 }

 controller.commandStack_sharedInvokement(
 "move_moveByCache",
 source.unitId,
 source.x,
 source.y,
 0
 );
 });

 model.event_on("move_clearWayCache",function(){
 model.move_pathCache.resetValues();
 });

 model.event_on("move_appendToWayCache",function(){
 var i = 0;

 // search first free slot in the cache list
 while( model.move_pathCache[i] !== INACTIVE_ID ){
 i++;
 if( i >= MAX_SELECTION_RANGE ) assert(false);
 }

 // add tiles to cache path
 var argI = 0;
 while( argI < arguments.length ){
 model.move_pathCache[i] = arguments[argI];
 argI++;
 i++;

 if( i >= MAX_SELECTION_RANGE ) assert(false);
 }
 });
 */