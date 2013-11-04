// Loads a modification into the game engine.
//
model.modification_load = function( data ){
  
  // register data types
  model.weatherTypeParser.parseAll(data.weathers);
  model.tileTypeParser.parseAll(data.tiles);
  model.moveTypeParser.parseAll(data.movetypes);
  model.unitTypeParser.parseAll(data.units);
  model.factionParser.parseAll(data.factions);
  model.coTypeParser.parseAll(data.commanders);
  
  // register localization
  var i,e;
  
  // TODO: GLOBAL RULES needed ?
  for( i=0,e=data.rule_global.length; i<e; i++ ) model.rule_push( data.rule_global[i], false );

  model.language = data.language;
  
  // TODO: re-check this after graphic relayout
  // register graphic and sound locations
  model.graphics  = data.graphics;
  model.sounds    = data.sounds;
  model.map_datas = data.maps;
};
