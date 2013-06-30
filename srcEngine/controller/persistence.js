util.scoped(function(){

  /**
   * Deserializes an unit object and prepares the model.
   *
   * @param {Array} data
   */
  function deserializeUnit( data ){
    
    // GET UNIT
    var id = data[0];
    var unit = model.units[id];
    
    // INJECT DATA
    unit.type     = model.unitTypes[data[1]];
    unit.x        = data[2];
    unit.y        = data[3];
    unit.hp       = data[4];
    unit.ammo     = data[5];
    unit.fuel     = data[6];
    unit.loadedIn = data[7];
    unit.owner    = data[8];
    
    model.unitPosMap[ data[2] ][ data[3] ] = unit;
  };  
  
  /**
   * Serializes an unit object.
   *
   * @param {object} unit
   */
  function serializeUnit( unit ){
    
    return [
      model.extractUnitId(unit),
      unit.type.ID,
      unit.x,
      unit.y,
      unit.hp,
      unit.ammo,
      unit.fuel,
      unit.loadedIn,
      unit.owner
    ];
  };
  
  /**
   * Serializes an player object.
   *
   * @param {object} player
   */
  function serializePlayer( player ){
    
    return [
      player.extractPlayerId( player ),
      player.name,
      player.gold,
      player.team,
      (player.mainCo)? player.mainCo.ID: "",
      (player.sideCo)? player.sideCo.ID: "",
      player.power,
      player.timesPowerUsed
    ];
  };
  
  /**
   * Deserializes an player object and prepares the model.
   *
   * @param {Array} data
   */
  function deserializePlayer( data ){
    
    // GET PLAYER
    var id = data[0];
    var player = model.players[id];
    
    // BASE DATA
    player.name = data[1];
    player.gold = data[2];
    player.team = data[3];
    
    // CO DATA
    (data[4])? player.mainCo = model.coTypes[data[4]]: null;
    (data[5])? player.sideCo = model.coTypes[data[5]]: null;
    player.power = data[6];
    player.timesPowerUsed = data[7];
  };
  
  /**
   * Serializes a property object.
   *
   * @param {object} property
   */
  function serializeProperty( property ){
    
    // SEARCH POSITION
    var px,py;
    var found = false;
    for( var x=0; x<model.mapWidth && !found; x++ ){
      for( var y=0; y<model.mapHeight && !found; y++ ){
        if( model.propertyPosMap[x][y] === property ){
          px = x;
          py = y; // TODO GRAB FROM OBJECT LATER
          found = true;
        }
      }
    }
    
    return [
      model.extractPropertyId( property ),
      px,
      py,
      property.type.ID,
      property.capturePoints,
      property.owner
    ];
  };
  
  function deserializeProperty( data ){
    
    // GET PROPERTY
    var id = data[0];
    var property = model.properties[id];
    
    // INJECT DATA
    property.type          = model.tileTypes[data[3]];
    property.capturePoints = data[4];
    property.owner         = data[5];
    property.x = data[1];
    property.y = data[2];
    
    model.propertyPosMap[ data[1] ][ data[2] ] = property;
  };
  
  
  // --------------------------------------------------------------- //
  // --------------------------------------------------------------- //
  
  /**
   * Generates an object model from the CWT domain model.
   * 
   * @returns {object} object model from CWT domain model
   */
  model.getCompactModel = function(){
    
    var dom = {};
    
    // META DATA
    dom.day = model.day;
    dom.turnOwner = model.turnOwner;
    dom.mapWidth = model.mapWidth;
    dom.mapHeight = model.mapHeight;
    dom.timeElapsed = model.timeElapsed;
        
    // MAP
    dom.map = [];
    var mostIdsMap = {};
    var mostIdsMapCurIndex = 0;
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      
      dom.map[x] = [];
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        
        var type = dom.map[x][y].ID;
        
        if( !mostIdsMap.hasOwnProperty(type) ){
          mostIdsMap[type] = mostIdsMapCurIndex;
          mostIdsMapCurIndex++;
        }
        
        dom.map[x][y] = mostIdsMap[type];
      }
    }
    
    // ADD TYPE MAP
    dom.typeMap = [];
    var typeKeys = Object.keys( mostIdsMap );
    for( var i=0,e=typeKeys.length; i<e; i++ ){
      dom.typeMap[ mostIdsMap[typeKeys[i]] ] = typeKeys[i];
    }
    
    // UNITS
    dom.units = [];
    for( var i=0,e=model.units.length; i<e; i++ ){
      if( model.units[i].owner !== CWT_INACTIVE_ID ){
        dom.units.push( serializeUnit(model.units[i]) );
      }
    }
    
    // PROPERTIES
    dom.properties = [];
    for( var i=0,e=model.properties.length; i<e; i++ ){
      if( model.properties[i].owner !== CWT_INACTIVE_ID ){
        dom.properties.push( serializeProperty(model.properties[i]) );
      }
    }
    
    // PLAYERS
    dom.players = [];
    for( var i=0,e=model.players.length; i<e; i++ ){
      if( model.players[i].team !== CWT_INACTIVE_ID ){
        dom.players.push( serializePlayer(model.players[i]) );
      }
    }
    
    // ACTORS
    dom.actors = [];
    for( var i=0,e=model.leftActors.length; i<e; i++ ){
      if( model.leftActors[i] ){
        dom.actors.push( i );
      }
    }
    
    // TURN TIMERS
    dom.timers = [];
    for( var i=0,e=model.turnTimedEvents_time_.length; i<e; i++ ){
      if( model.turnTimedEvents_time_[i] !== null ){
        dom.timers.push([
          model.turnTimedEvents_time_[i],
          model.turnTimedEvents_data_[i]
        ]);
      }
    }
        
    return dom;
    
  };
  
  /**
   * Loads a CWT domain model from a given object model.
   * 
   * @param {object} data
   */
  model.loadCompactModel = function( data ){
    
    model.day = data.day;
    model.turnOwner = data.turnOwner;
    model.mapWidth = data.mapWidth;
    model.mapHeight = data.mapHeight;
    model.timeElapsed = data.timeElapsed;
        
    // MAP
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.unitPosMap[x][y] = null;
        model.propertyPosMap[x][y] = null;
        model.map[x][y] = model.tileTypes[ data.typeMap[ data.map[x][y] ] ];
      }
    }
    
    // UNITS
    for( var i=0,e=model.units.length; i<e; i++ ){
      model.units[i].owner = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.units.length; i<e; i++ ){
      deserializeUnit( data.units[i] );
    }
    
    // PROPERTIES
    for( var i=0,e=model.properties.length; i<e; i++ ){
      model.properties[i].owner = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.properties.length; i<e; i++ ){
      deserializeProperty( data.properties[i] );
    }
    
    // PLAYERS
    for( var i=0,e=model.players.length; i<e; i++ ){
      model.players[i].team = CWT_INACTIVE_ID;
    }
    
    for( var i=0,e=data.players.length; i<e; i++ ){
      deserializePlayer( data.players[i] );
    }
    
    // ACTORS
    for( var i=0,e=model.leftActors.length; i<e; i++ ){
      model.leftActors[i] = false;
    }
    
    for( var i=0,e=data.leftActors.length; i<e; i++ ){
      model.leftActors[ data.leftActors[i] ] = true;
    }
    
    // TURN TIMERS
    for( var i=0,e=model.turnTimedEvents_time_.length; i<e; i++ ){
      model.turnTimedEvents_time_[i] = null;
      model.turnTimedEvents_data_[i] = null;
    }
    
    for( var i=0,e=data.timers.length; i<e; i++ ){
      model.turnTimedEvents_time_[i] = data.timers[i][0];
      model.turnTimedEvents_data_[i] = data.timers[i][1];
    }
    
    // MAP RULES
    model.mapRules.splice(0);
    for( var i=0,e=data.rules.length; i<e; i++ ){
      model.parseRule( data.rules[i], true );
    }
    
    // BUILD CONFIG
    controller.buildRoundConfig({});
  };
  
});


util.scoped(function(){
  var persistence = [];
  
  controller.persisted = function( descr ){
    util.hasProperties( descr, "object", "onsave", "onload" );
    
    if( typeof descr.onsave !== "function" ) util.raiseError("save callback has to be a function");
    if( typeof descr.onload !== "function" ) util.raiseError("load callback has to be a function");
    
    // register saver/loader
    persistence.push([
      descr.object,
      descr.onsave,
      descr.onload
    ]);
    
    return descr.object;
  };
  
  // Saves the current game model to a JSON string.
  controller.saveCompactModel = function(){
    var dom = {};
    
    var obj;
    for( var i=0,e=persistence.length; i<e; i++ ){
      obj = persistence[i];
      
      obj[1].call( obj[0], dom );
    }
    
    return JSON.stringify(dom);
  };
  
  // Loads a given JSON string into the model. 
  controller.loadCompactModel = function( data ){
    var dom = JSON.parse(data);
    
    var obj;
    for( var i=0,e=persistence.length; i<e; i++ ){
      obj = persistence[i];
      
      obj[2].call( obj[0], dom );
    }
  };
});