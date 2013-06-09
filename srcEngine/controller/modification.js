/**
 * Loads a modification into the game engine.
 * 
 * @param {Object} data
 */
model.loadModification = function( data ){
  var i,e;
  
  // WEATHERS
  for( i=0,e=data.weathers.length; i<e; i++ ) model.parseWeatherType( data.weathers[i] );
  
  // TILES
  for( i=0,e=data.tiles.length; i<e; i++ ) model.parseTileType( data.tiles[i] );
  
  // MOVETYPES
  for( i=0,e=data.movetypes.length; i<e; i++ ) model.parseMoveType( data.movetypes[i] );
  
  // UNITS
  for( i=0,e=data.units.length; i<e; i++ ) model.parseUnitType( data.units[i] );
  
  // FACTIONS
  for( i=0,e=data.factions.length; i<e; i++ ) model.parseFactionType( data.factions[i] );
  
  // COMMANDERS (CO)
  for( i=0,e=data.commanders.length; i<e; i++ ) model.parseCoType( data.commanders[i] );
  
  
  // GLOBAL RULES (TODO: NEEDED?)
  for( i=0,e=data.globalRules.length; i<e; i++ ) model.parseRule( data.globalRules[i], false );
  
  // GRAPHICS AND SOUNDS
  model.graphics = data.graphics;
  model.sounds = data.sounds;
  model.maps = data.maps;
          
  // LANG
  model.language = data.language;
};