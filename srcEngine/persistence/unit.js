model.unitTypeParser.addHandler(function(sheet){

  assert( model.moveTypes.hasOwnProperty(sheet.movetype) );

  assert( util.intRange( sheet.range, 0, MAX_SELECTION_RANGE ) );
  assert( util.intRange( sheet.fuel, 0, 99 ) );
  
  assert( (typeof sheet.stealth === "undefined" || typeof sheet.stealth === "boolean") );
});

controller.persistence_defineHandler(
  
  // load
  function(dom){
    var data;
    
    // reset model data
    for( var i=0,e=model.unit_data.length; i<e; i++ ){
      model.unit_data[i].owner = INACTIVE_ID;
    }
    
    // place model data by dom if given
    if( dom.units ){

      assert( Array.isArray(dom.units) );

      for( var i=0,e=dom.units.length; i<e; i++ ){
        data = dom.units[i];
        
        // check data of the data block this save handler uses a differn't saving schema
        assert( util.isInt(data[0]) );
        assert( typeof data[1] === "string" );
        assert( model.unitTypes.hasOwnProperty(data[1]));

        var type = model.unitTypes[data[1]];

        assert( model.map_isValidPosition(data[2],data[3]) );
        assert( util.intRange( data[4] , 1, 99 ) );
        assert( util.intRange( data[5] , 0, type.ammo ) );
        assert( util.intRange( data[6] , 0, type.fuel ) );
        assert( util.isInt(data[7]) );
        assert( model.player_isValidPid(data[8]) );

        // get unit object
        var id        = data[0];
        var unit      = model.unit_data[id];
        
        // inject data
        unit.type     = type;
        unit.x        = data[2];
        unit.y        = data[3];
        unit.hp       = data[4];
        unit.ammo     = data[5];
        unit.fuel     = data[6];
        unit.loadedIn = data[7]; // TODO: move to transport
        unit.owner    = data[8];
        
        model.unit_posData[ data[2] ][ data[3] ] = unit;
      }
    }
  },
  
  // save
  function(dom){    
    var unit;
    
    dom.units = [];    
    for( var i=0,e=model.unit_data.length; i<e; i++ ){
      unit = model.unit_data[i];
      
      if( unit.owner !== INACTIVE_ID ){
        dom.units.push([
          model.unit_extractId(unit),
          unit.type.ID,
          unit.x,
          unit.y,
          unit.hp,
          unit.ammo,
          unit.fuel,
          unit.loadedIn,
          unit.owner
        ]);
      }
    }
  }
);
