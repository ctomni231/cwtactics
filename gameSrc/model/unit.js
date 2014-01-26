cwt.Unit = my.Class({

    STATIC: {

      /**
       * Converts HP points to a health value.
       * 
       * @example
       *    6 HP -> 60 health
       *    3 HP -> 30 health
       */
      pointsToHealth: function( pt ){
        assert( util.intRange(pt,0,10) );
        return (pt*10);
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
      healthToPoints: function( health ){
        if( typeof hp !== "number" ) hp = hp.hp; 
        return parseInt( hp/10, 10 )+1;
      },

      /**
       * Gets the rest of unit health.
       */
      healthToPointsRest: function( health ){
        assert( util.intRange(unit.hp,0,99) );
        return unit.hp - (parseInt( unit.hp/10 )+1);
      }

    },

    initialize: function(type){
      this.x = 0;
      this.y = 0;
      this.hp = 99;
      this.ammo = 0;
      this.fuel = 0;
      this.hidden = false;
      this.loadedIn = INACTIVE_ID;
      this.type = cwt.Database.getTileSheet(type);
      
      this.resupply();
    },

    /**
     * Refills the supplies of the unit.
     */
    resupply: function(){
      this.ammo = this.type.ammo;
      this.fuel = this.type.fuel;
    }
});