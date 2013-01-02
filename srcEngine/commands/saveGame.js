controller.SERIALIZATION_MAP = "map";
controller.SERIALIZATION_MAP_H = "mapHeight";
controller.SERIALIZATION_MAP_W = "mapWidth";

controller.SERIALIZATION_UNITS = "units";
controller.SERIALIZATION_UNITS_POS = "unitPosMap";

controller.SERIALIZATION_PROPS = "properties";
controller.SERIALIZATION_PROPS_POS = "propertyPosMap";

controller.SERIALIZATION_PLAYERS = "players";

controller.SERIALIZATION_DAY = "day";
controller.SERIALIZATION_TURNOWNER = "turnOwner";
controller.SERIALIZATION_LEFTACTORS = "leftActors";


controller.registerCommand({

  key: "saveGame",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( util.DEBUG ){ util.logInfo("start saving game instance"); }

    var json = {};

    // ------------------------------------------------------------------------
    // MAP

    json[ controller.SERIALIZATION_MAP ] = util.matrix(
      model.mapWidth,model.mapHeight, null
    );

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        json[ controller.SERIALIZATION_MAP ][x][y] = model.map[x][y];
      }
    }

    json[ controller.SERIALIZATION_MAP_H ] = model.mapHeight;
    json[ controller.SERIALIZATION_MAP_W ] = model.mapWidth;

    // ------------------------------------------------------------------------
    // UNITS

    json[ controller.SERIALIZATION_UNITS ] = {};
    for( var i=0,e=model.units.length; i<e; i++ ){
      var unit = model.units[i];
      if( unit.owner !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_UNITS ][i] = unit;
      }
    }

    json[ controller.SERIALIZATION_UNITS_POS ] = {};
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        var unit = model.unitPosMap[x][y];
        if( unit !== null ){
          json[ controller.SERIALIZATION_UNITS_POS ][ x+","+y ] = model.extractUnitId(unit);
        }
      }
    }

    // ------------------------------------------------------------------------
    // PROPS

    json[ controller.SERIALIZATION_PROPS ] = {};
    for( var i=0,e=model.properties.length; i<e; i++ ){
      var prop = model.properties[i];
      if( prop.owner !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_PROPS ][i] = prop;
      }
    }

    json[ controller.SERIALIZATION_PROPS_POS ] = {};
    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        var prop = model.propertyPosMap[x][y];
        if( prop !== null ){
          json[ controller.SERIALIZATION_PROPS_POS ][ x+","+y ] = model.extractPropertyId(prop);
        }
      }
    }

    // ------------------------------------------------------------------------
    // ROUND

    json[ controller.SERIALIZATION_DAY ] = model.day;
    json[ controller.SERIALIZATION_TURNOWNER ] = model.turnOwner;
    json[ controller.SERIALIZATION_LEFTACTORS ] = model.leftActors;

    // ------------------------------------------------------------------------
    // PLAYERS

    json[ controller.SERIALIZATION_PLAYERS ] = {};
    for( var i=0,e=model.players.length; i<e; i++ ){
      var player = model.players[i];
      if( player.team !== CWT_INACTIVE_ID ){
        json[ controller.SERIALIZATION_PLAYERS ][i] = player;
      }
    }

    // ------------------------------------------------------------------------

    json = JSON.stringify( json, null, "\t" ); // SERIALIZE IT
    data.setSubAction( json );

    if( util.DEBUG ){ util.logInfo("game instance successfully saved"); }
  }
});