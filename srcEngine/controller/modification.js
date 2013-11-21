// Loads a modification into the game engine.
//
model.modification_load = function( data ){
  
  // register data sheets
  model.data_weatherParser.parseAll(    data.weathers);
  model.data_tileParser.parseAll(       data.tiles);
  model.data_movetypeParser.parseAll(   data.movetypes);
  model.data_unitParser.parseAll(       data.units);
  model.data_fractionParser.parseAll(   data.fraction);
  model.data_coParser.parseAll(         data.co);
  model.data_gameModeParser.parseAll(   data.gamemode);

  // asset data
  model.data_language  = data.language;
  model.data_graphics  = data.graphics;
  model.data_sounds    = data.sounds;
  model.data_header    = data.header;
  model.data_assets    = data.assets;
  model.data_menu      = data.menu;
  model.data_maps      = data.maps;

  // for( i=0,e=data.rule_global.length; i<e; i++ ) model.rule_push( data.rule_global[i], false );
};