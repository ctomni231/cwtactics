// Loads a modification into the game engine.
// 
// @param {Object} data
//
model.loadModification = function( data ){
  
  // register data types
  model.weatherTypeParser.parseAll(data.weathers);
  model.tileTypeParser.parseAll(data.tiles);
  model.moveTypeParser.parseAll(data.movetypes);
  model.unitTypeParser.parseAll(data.units);
  model.factionParser.parseAll(data.factions);
  model.coTypeParser.parseAll(data.commanders);
  
  // register localization
  var i,e;
  
  // GLOBAL RULES (TODO: NEEDED?)
  for( i=0,e=data.globalRules.length; i<e; i++ ) model.parseRule( data.globalRules[i], false );

  model.language = data.language;
  
  // register graphic and sound locations
  model.graphics = data.graphics;
  model.sounds = data.sounds;
  model.maps = data.maps;
};