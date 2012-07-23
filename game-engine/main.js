/**
 * Custom Wars Tactics main namespace.
 *
 * @namespace
 */
var cwt = {

  /** @namespace */
  mod:{},

  loadDefaultMod: function(){

    var mod = cwt.mod.awds;
    var list;

    list = mod.movetypes;
    for( var i=0,e=list.length; i<e; i++ ){
      cwt.db.parse( list[i], cwt.db.types.MOVE_TYPE );
    }

    list = mod.weapons;
    for( var i=0,e=list.length; i<e; i++ ){
      cwt.db.parse( list[i], cwt.db.types.WEAPON );
    }

    list = mod.tiles;
    for( var i=0,e=list.length; i<e; i++ ){
      cwt.db.parse( list[i], cwt.db.types.TILE );
    }

    list = mod.units;
    for( var i=0,e=list.length; i<e; i++ ){
      cwt.db.parse( list[i], cwt.db.types.UNIT );
    }
  },

  /** @namespace */
  util:{

    /**
     * Iterates all keys of an object and calls a callback function on every key.
     */
    each: function( obj, callback ){
      var keys = Object.keys(obj);
      for(var i = 0, e = keys.length; i < e; i++){
        callback( obj[keys[i]], keys[i] );
      }
    },

    /**
     * A function that always returning the value 'true'.
     */
    trueReturner: function(){ 
      return true; 
    }
  },

  /**
   * Starts the engine and calls the initializer functions.
   */ 
  start: function(){

    // call initializer functions on every module property
    cwt.util.each( cwt, function( module, key ){
      if( key !== 'util' ){
        if( module.hasOwnProperty("init") ){
          console.log("initializing cwt."+key);
          module.init();
        }
      }
    });
  }
};