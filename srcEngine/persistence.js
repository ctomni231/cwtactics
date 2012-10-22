/** @constant */
signal.EVENT_LOAD_GAMEDATA = "game:load";

/** @constant */
signal.EVENT_SAVE_GAMEDATA = "game:save";

/**
 * Persists the actual game instance.
 */
persistence.save = function(){

  signal.emit( signal.EVENT_SAVE_GAMEDATA );

  // SERIALIZE
  return JSON.stringify( domain );
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

  // ANY CHANGES TO THE LOADED DATA ?!
  signal.emit( signal.EVENT_LOAD_GAMEDATA, mapData );

  // LOAD MAP FROM DATA
  signal.emit( game.EVENT_LOAD_MAP, mapData );
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

  var langs = modification.locale;
  if( langs !== undefined ){

    var langIds = Object.keys( langs );
    for( var i=0,e=langIds.length; i<e; i++ ){
      locale.appendToLanguage( langIds[i], langs[ langIds[i] ] );
    }
  }
};