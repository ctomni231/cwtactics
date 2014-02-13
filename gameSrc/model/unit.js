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
    model.events.clearUnitPosition(uid);

    this.owner = null;
    cwt.ClientEvents.unitDestroyed(this);

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 &&
        model.unit_countUnits(this.owner) === 0) {
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