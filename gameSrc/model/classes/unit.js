//
//
// @class
// @extends cwt.IndexMultiton.<T>
//
cwt.UnitClass = my.Class({

    STATIC: {

      //
      // Maximum number of unit objects for the whole game.
      //
      MULTITON_INSTANCES: cwt.Player.MAX_UNITS * cwt.Player.MULTITON_INSTANCES,

      //
      // Converts HP points to a health value.
      //
      // @return {number}
      //
      // @example
      //    6 HP -> 60 health
      //    3 HP -> 30 health
      //
      pointsToHealth: function(pt) {
        return (pt * 10);
      },

      //
      // Converts and returns the HP points from the health
      // value of an unit.
      //
      // @example
      //   health ->  HP
      //     69   ->   7
      //     05   ->   1
      //     50   ->   6
      //     99   ->  10
      //
      healthToPoints: function(health) {
        return parseInt(health / 10, 10) + 1;
      },

      //
      // Gets the rest of unit health.
      //
      healthToPointsRest: function(health) {
        return health - (parseInt(health / 10) + 1);
      },

      //
      // Counts the number of units of a player.
      //
      // @param player
      // @return {number}
      //
      countUnitsOfPlayer: function(player) {
        var n = 0;
        for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
          var unit = cwt.Unit.getInstance(i, false);
          if (unit && unit.owner === player) {
            n++;
          }
        }

        return n;
      },

      destroyPlayerUnits: function(player) {
        if (cwt.DEBUG) cwt.assert(player instanceof cwt.Player);
        for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
          var unit = cwt.Unit.getInstance(i, false);
          if (unit && unit.owner === player) {
            // TODO
          }
        }
      }
    },

    constructor: function() {
      this.hp = 99;
      this.ammo = 0;
      this.fuel = 0;

      //
      //
      // // type {number} 0=visible, 1=hidden but visible by enemy or 2=complete hidden
      // @type {boolean}
      //
      this.hidden = false;

      this.loadedIn = cwt.INACTIVE;

      this.type = null;
      this.canAct = false;

      //
      // If the value is null then unit does not exists on the map.
      //
      // @type {cwt.Player}
      //
      this.owner = null;
    },

    initByType: function(type) {

    },

    //
    // Damages a unit.
    //
    takeDamage: function(damage, minRest) {
      this.hp -= damage;

      if (minRest && this.hp <= minRest) {
        this.hp = minRest;
      }
    },

    //
    // Heals an unit. If the unit health will be greater than the maximum
    // health value then the difference will be added as gold to the
    // owners gold depot.
    //
    heal: function(health, diffAsGold) {
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

    //
    // @return {boolean} true when hp is greater than 0 else false
    //
    isAlive: function() {
      return this.hp > 0;
    },

    //
    // Returns true when the unit ammo is lower equals 25%.
    //
    // @return {boolean}
    //
    hasLowAmmo: function() {
      var cAmmo = this.ammo;
      var mAmmo = this.type.ammo;
      if (mAmmo != 0 && cAmmo <= parseInt(mAmmo * 0.25, 10)) {
        return true;
      } else {
        return false;
      }
    },

    //
    // Returns true when the unit fuel is lower equals 25%.
    //
    // @return {boolean}
    //
    hasLowFuel: function() {
      var cFuel = this.fuel;
      var mFuel = this.type.fuel;
      if (cFuel <= parseInt(mFuel * 0.25, 10)) {
        return true;
      } else {
        return false;
      }
    },

    isCapturing: function() {
      if (this.loadedIn != cwt.INACTIVE) {
        return false;
      }

      return false;
      /*
    if( unit.x >= 0 ){
      var property = model.property_posMap[ unit.x ][ unit.y ];
      if( property !== null && property.capturePoints < 20 ){
        unitStatus.CAPTURES = true;
      }
      else unitStatus.CAPTURES = false;
    } */
    }

    /*
   function inVision( x,y, tid, unitStatus ){
   if( !model.map_isValidPosition(x,y) ) return;

   var unit = model.unit_posData[x][y];
   if( unit ){
   if( model.player_data[unit.owner].team !== tid ) unitStatus.VISIBLE = true;

   // IF UNIT IS HIDDEN THEN YOU CAN SEE IT NOW
   if( unit.hidden ) controller.unitStatusMap[ model.unit_extractId(unit) ].VISIBLE = true;
   }
   };

   function checkHiddenStatus( unit, unitStatus ){
   if( !unitStatus ){
   unitStatus = controller.unitStatusMap[ model.unit_extractId(unit) ];
   }

   unitStatus.VISIBLE = true;
   if( unit.hidden ){
   unitStatus.VISIBLE = false;

   // CHECK NEIGHBOURS AND HIDDEN ON NEIGHBOURS
   var x = unit.x;
   var y = unit.y;
   var ttid = model.player_data[unit.owner].team;
   inVision( x-1,y, ttid, unitStatus );
   inVision( x,y-1, ttid, unitStatus );
   inVision( x,y+1, ttid, unitStatus );
   inVision( x+1,y, ttid, unitStatus );
   }
   };function inVision( x,y, tid, unitStatus ){
   if( !model.map_isValidPosition(x,y) ) return;

   var unit = model.unit_posData[x][y];
   if( unit ){
   if( model.player_data[unit.owner].team !== tid ) unitStatus.VISIBLE = true;

   // IF UNIT IS HIDDEN THEN YOU CAN SEE IT NOW
   if( unit.hidden ) controller.unitStatusMap[ model.unit_extractId(unit) ].VISIBLE = true;
   }
   };

   function checkHiddenStatus( unit, unitStatus ){
   if( !unitStatus ){
   unitStatus = controller.unitStatusMap[ model.unit_extractId(unit) ];
   }

   unitStatus.VISIBLE = true;
   if( unit.hidden ){
   unitStatus.VISIBLE = false;

   // CHECK NEIGHBOURS AND HIDDEN ON NEIGHBOURS
   var x = unit.x;
   var y = unit.y;
   var ttid = model.player_data[unit.owner].team;
   inVision( x-1,y, ttid, unitStatus );
   inVision( x,y-1, ttid, unitStatus );
   inVision( x,y+1, ttid, unitStatus );
   inVision( x+1,y, ttid, unitStatus );
   }
   };

   model.event_on("damageUnit",function( uid ){
   controller.updateUnitStatus( uid );
   });

   model.event_on("healUnit",function( uid ){
   controller.updateUnitStatus( uid );
   });

   model.event_on("battle_mainAttack",function( auid,duid,dmg,mainWeap ){
   var type = model.unit_data[auid].type;
   var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
   if( sound ) controller.audio_playSound( sound );
   });

   model.event_on("battle_counterAttack",function( auid,duid,dmg,mainWeap ){
   var type = model.unit_data[auid].type;
   var sound = (mainWeap)? type.assets.pri_att_sound : type.assets.sec_att_sound;
   if( sound ) controller.audio_playSound( sound );
   });

  model.event_on("attack_invoked",function( auid,duid ){
    controller.updateSimpleTileInformation();
    controller.updateUnitStatus( auid );
    controller.updateUnitStatus( duid );
  });

model.event_on("buildUnit_invoked",function(){
  controller.updateSimpleTileInformation();
});


model.event_on("createUnit",function( id ){
  controller.updateUnitStatus( id );
});

model.event_on("loadUnit_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("unloadUnit_invoked",function( transportId, trsx, trsy, loadId, tx,ty ){
  controller.updateUnitStatus( transportId );
});

model.event_on("joinUnits_invoked",function( uid, tid ){
  controller.updateUnitStatus( tid );
});

model.event_on("supply_refillResources",function( uid ){
  if( typeof uid.x === "number" ) uid = model.unit_extractId(uid);
  controller.updateUnitStatus( uid );
});

model.event_on("clearUnitPosition",function( uid ){
  var unit = model.unit_data[uid];
  var x = -unit.x;
  var y = -unit.y;

  // CHECK HIDDEN, BUT VISIBLE NEIGHBOURS
  if( model.map_isValidPosition(x-1,y) && model.unit_posData[x-1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x-1][y]) );
  }
  if( model.map_isValidPosition(x+1,y) && model.unit_posData[x+1][y] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x+1][y]) );
  }
  if( model.map_isValidPosition(x,y+1) && model.unit_posData[x][y+1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y+1]) );
  }
  if( model.map_isValidPosition(x,y-1) && model.unit_posData[x][y-1] ){
    controller.updateUnitStatus( model.unit_extractId(model.unit_posData[x][y-1]) );
  }
});

model.event_on("setUnitPosition",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitHide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});

model.event_on("unitUnhide_invoked",function( uid ){
  controller.updateUnitStatus( uid );
});
//
});

// use index based multiton trait
my.extendClass(cwt.Unit,{STATIC:cwt.IndexMultiton});
*/
