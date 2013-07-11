// Loads a modification into the game engine.
// 
// @param {Object} data
//
model.loadModification = function( data ){
  var i,e;
  
  // register weather types
  for( i=0,e=data.weathers.length; i<e; i++ ) model.parseWeatherType( data.weathers[i] );
  
  // register tile types
  for( i=0,e=data.tiles.length; i<e; i++ ) model.parseTileType( data.tiles[i] );
  
  // register move types
  for( i=0,e=data.movetypes.length; i<e; i++ ) model.parseMoveType( data.movetypes[i] );
  
  // register unit types
  for( i=0,e=data.units.length; i<e; i++ ) model.parseUnitType( data.units[i] );
  
  // register faction types
  for( i=0,e=data.factions.length; i<e; i++ ) model.parseFactionType( data.factions[i] );
  
  // register CO/Commander types
  for( i=0,e=data.commanders.length; i<e; i++ ) model.parseCoType( data.commanders[i] );
  
  // register localization
  model.language = data.language;
  
  // GLOBAL RULES (TODO: NEEDED?)
  for( i=0,e=data.globalRules.length; i<e; i++ ) model.parseRule( data.globalRules[i], false );
            
  // graphic and sound locations
  model.graphics = data.graphics;
  model.sounds = data.sounds;
  model.maps = data.maps;
};