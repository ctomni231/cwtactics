cwt.defineLayer( CWT_LAYER_PERSISTENCE,
  function(persistence,model,sheets,data,util){

  /**
   * Persists the actual game instance.
   */
  persistence.save = function(){
    // SERIALIZE
    return JSON.stringify( model );
  };

  /**
   * Loads a game from a data block.
   *
   * @param data
   */
  persistence.load = function( mapData ){
    if( typeof mapData === 'string' ){

      // DESERIALIZE IF YOU GOT A SERIALIZED MODEL
      try{
        mapData = JSON.parse( mapData );
      }
      catch( e ){
        if( util.DEBUG ) util.logError("got invalid json save data");
      }
    }

    // LOAD MAP FROM DATA
    data.loadMap( mapData );
  };

  /**
   * Loads a modification into the game engine.
   */
  persistence.loadModification = function( modification ){
    var list;

    list = modification.movetypes;
    for( var i=0,e=list.length; i<e; i++ ){
      sheets.parseSheet( list[i], sheets.MOVE_TYPE_SHEET );
    }

    list = modification.weapons;
    for( var i=0,e=list.length; i<e; i++ ){
      sheets.parseSheet( list[i], sheets.WEAPON_TYPE_SHEET );
    }

    list = modification.tiles;
    for( var i=0,e=list.length; i<e; i++ ){
      sheets.parseSheet( list[i], sheets.TILE_TYPE_SHEET );
    }

    list = modification.units;
    for( var i=0,e=list.length; i<e; i++ ){
      sheets.parseSheet( list[i], sheets.UNIT_TYPE_SHEET );
    }
  };
});
cwt.finalizeLayer( CWT_LAYER_PERSISTENCE );