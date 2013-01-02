controller.registerCommand({

  key: "loadGame",

  _copyProps: function( source, target ){
    var keys = Object.keys( source );
    for( var i=0,e=keys.length; i<e; i++ ){
      target[ keys[i] ] = source[ keys[i] ];
    }
  },

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( util.DEBUG ){ util.logInfo("start loading game instance"); }

    var copy = this._copyProps;
    var mapData = data.getSubAction();

    // ------------------------------------------------------------------------
    // MAP

    model.mapHeight = mapData[ controller.SERIALIZATION_MAP_H ];
    model.mapWidth = mapData[ controller.SERIALIZATION_MAP_W ];

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.map[x][y] = mapData[ controller.SERIALIZATION_MAP ][x][y];
      }
    }

    // ------------------------------------------------------------------------
    // UNITS

    for( var i=0,e=model.units.length; i<e; i++ ){
      var unit = model.units[i];
      if( mapData[ controller.SERIALIZATION_UNITS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_UNITS ][i], unit );
      }
      else{
        unit.owner = CWT_INACTIVE_ID;
      }
    }

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.unitPosMap[x][y] = null;
      }
    }

    var posKeys;
    posKeys = Object.keys(mapData[ controller.SERIALIZATION_UNITS_POS ] );
    for( var i=0,e=posKeys.length; i<e; i++ ){
      var parts = posKeys[i].split(",");
      var x = parseInt( parts[0], 10 );
      var y = parseInt( parts[1], 10 );

      model.unitPosMap[x][y] = model.units[
        mapData[ controller.SERIALIZATION_UNITS_POS ][ posKeys[i] ]
      ];
    }

    // ------------------------------------------------------------------------
    // PROPS

    for( var i=0,e=model.properties.length; i<e; i++ ){
      var prop = model.properties[i];
      if( mapData[ controller.SERIALIZATION_PROPS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_PROPS ][i], prop );
      }
      else{
        prop.owner = CWT_INACTIVE_ID;
      }
    }

    for( var x=0,xe=model.mapWidth; x<xe; x++ ){
      for( var y=0,ye=model.mapHeight; y<ye; y++ ){
        model.propertyPosMap[x][y] = null;
      }
    }

    posKeys = Object.keys(mapData[ controller.SERIALIZATION_PROPS_POS ] );
    for( var i=0,e=posKeys.length; i<e; i++ ){
      var parts = posKeys[i].split(",");
      var x = parseInt( parts[0], 10 );
      var y = parseInt( parts[1], 10 );

      model.propertyPosMap[x][y] = model.properties[
        mapData[ controller.SERIALIZATION_PROPS_POS ][ posKeys[i] ]
      ];
    }

    // ------------------------------------------------------------------------
    // ROUND

    model.day = mapData[ controller.SERIALIZATION_DAY ];
    model.turnOwner = mapData[ controller.SERIALIZATION_TURNOWNER ];
    // model.leftActors = mapData[ controller.SERIALIZATION_LEFTACTORS ];

    if( mapData[ controller.SERIALIZATION_LEFTACTORS ] !== undefined ){
      for( var i=0,e= mapData[ controller.SERIALIZATION_LEFTACTORS ].length;
           i<e; i++ ){

        model.leftActors[i] =  mapData[ controller.SERIALIZATION_LEFTACTORS ][i];
      }
    }
    else util.fill( model.leftActors, true );

    // ------------------------------------------------------------------------
    // PLAYERS

    for( var i=0,e=model.players.length; i<e; i++ ){
      var player = model.players[i];
      if( mapData[ controller.SERIALIZATION_PLAYERS ].hasOwnProperty(i) ){
        copy( mapData[ controller.SERIALIZATION_PLAYERS ][i], player );
      }
      else{
        player.team = CWT_INACTIVE_ID;
      }
    }

    // ------------------------------------------------------------------------

    if( util.DEBUG ){ util.logInfo("game instance successfully loaded"); }
  }
});