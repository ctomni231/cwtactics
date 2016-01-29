model.event_on("prepare_game",function( dom ){
  model.map_width   = dom.mpw;
  model.map_height  = dom.mph;
  
  for( var x=0,xe=model.map_width; x<xe; x++ ){
    for( var y=0,ye=model.map_height; y<ye; y++ ){
      model.unit_posData[x][y]    = null;
      model.property_posMap[x][y] = null;
      model.map_data[x][y]        = model.data_tileSheets[ dom.typeMap[ dom.map[x][y] ] ];
    }
  }
});

// model.event_on("load_game",function( dom ){});

model.event_on("save_game",function( dom ){
  dom.mpw = model.map_width;
  dom.mph = model.map_height;
  dom.map = [];
  
  // generates ID map
  var mostIdsMap = {};
  var mostIdsMapCurIndex = 0;
  for( var x=0,xe=model.map_width; x<xe; x++ ){
    
    dom.map[x] = [];
    for( var y=0,ye=model.map_height; y<ye; y++ ){
      
      var type = dom.map[x][y].ID;
      
      if( !mostIdsMap.hasOwnProperty(type) ){
        mostIdsMap[type] = mostIdsMapCurIndex;
        mostIdsMapCurIndex++;
      }
      
      dom.map[x][y] = mostIdsMap[type];
    }
  }
  
  // store map
  dom.typeMap = [];
  var typeKeys = Object.keys( mostIdsMap );
  for( var i=0,e=typeKeys.length; i<e; i++ ){
    dom.typeMap[ mostIdsMap[typeKeys[i]] ] = typeKeys[i];
  }
});