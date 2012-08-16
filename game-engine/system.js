/**
 * Custom Wars Tactics main namespace.
 *
 * All sub modules and parts of the game should be appended to this root object to use the annotation features of cwt.
 *
 * @namespace
 */
var cwt = {

  // TODO move some meta datas into an own sub module ( expcept DEBUG )
  // some flags
  DEBUG: false,

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

    setDebug: function( bool ){
      cwt.DEBUG = bool;
    },

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
    trueReturner: function(){ return true; }
  },

  /**
   * Starts the engine and calls the initializer functions.
   */ 
  start: function(){

    // call initializer functions on every module property
    cwt.util.each( cwt, function( module, key ){
      if( key !== 'util' ){
        // TODO solve organization of modules
        var hasInit = module !== null && module.hasOwnProperty("init");
          
        cwt.log.info( "initializing cwt.{0}{1}", key, ( hasInit )? ", calling module initializer" : "" );
        if( hasInit ){
          cwt.annotation._selectedMod = key;
          module.init( cwt.annotation ); 
        }
      }
    });

    cwt.annotation._selectedMod = null;
  }
};


