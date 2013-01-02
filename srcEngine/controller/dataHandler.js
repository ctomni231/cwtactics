/**
 * Persists the actual game instance.
 */
controller.saveDOM = function(){

  // SERIALIZE
  return JSON.stringify( model );
};

/**
 * Loads a game from a data block.
 *
 * @param data
 */
controller.loadDOM = function( mapData ){
  if( typeof mapData === 'string' ){

    // DESERIALIZE IF YOU GOT A SERIALIZED MODEL
    try{
      mapData = JSON.parse( mapData );
    }
    catch( e ){
      if( util.DEBUG ) throw Error("got invalid json save data");
    }

    throw Error("niy");
  }
};

/**
 * Loads a modification into the game engine.
 */
controller.loadMod = function( modification ){
  var list;

  list = modification.movetypes;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.MOVE_TYPE_SHEET );
  }

  list = modification.weapons;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.WEAPON_TYPE_SHEET );
  }

  list = modification.tiles;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.TILE_TYPE_SHEET );
  }

  list = modification.units;
  for( var i=0,e=list.length; i<e; i++ ){
    model.parseSheet( list[i], model.UNIT_TYPE_SHEET );
  }

  var langs = modification.locale;
  if( langs !== undefined ){

    var langIds = Object.keys( langs );
    for( var i=0,e=langIds.length; i<e; i++ ){
      util.i18n_appendToLanguage( langIds[i], langs[ langIds[i] ] );
    }
  }
};