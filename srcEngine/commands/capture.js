controller.registerCommand({

  key:"captureProperty",
  unitAction: true,

  // ------------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var unit = data.getTargetUnit();
    var property = data.getTargetProperty();

    return (
      property !== null &&
        model.turnOwner !== property.owner &&

      ( unit === null || unit === selectedUnit ) &&

      model.sheets.tileSheets[ property.type ].capturePoints > 0 &&
      model.sheets.unitSheets[ selectedUnit.type ].captures > 0
    );
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var selectedUnit = data.getSourceUnit();
    var property = data.getTargetProperty();
    var unitSh = model.sheets.unitSheets[ selectedUnit.type ];

    property.capturePoints -= unitSh.captures;
    if( property.capturePoints <= 0 ){
      if( DEBUG ){
        var x = data.getTargetX();
        var y = data.getTargetY();
        util.logInfo( "property at (",x,",",y,") captured");
      }

      if( property.type === 'HQTR' ){
        var pid = property.owner;
        var oldPlayer = model.players[pid];

        for( var i = pid*CWT_MAX_UNITS_PER_PLAYER,
                 e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

          model.units[i].owner = -1;
          model.eraseUnitPosition(i);
        }

        for( var i = 0, e = model.properties.length; i<e; i++ ){
          if( model.properties[i].owner === pid ){
            model.properties[i].owner = -1;
          }
        }

        oldPlayer.team = -1;

        // check win/loose
        var _teamFound = -1;
        for( var i=0,e=model.players.length; i<e; i++ ){
          var player = model.players[i];
          if( player.team !== -1 ){

            // FOUND AN ALIVE PLAYER
            if( _teamFound === -1 ) _teamFound = player.team;
            else if( _teamFound !== player.team ){
              _teamFound = -1;
              break;
            }
          }
        }

        // NO OPPOSITE TEAMS LEFT ?
        if( _teamFound !== -1 ){
          var nData = controller.aquireActionDataObject();
          nData.setAction( "endGame" );
          controller.pushActionDataIntoBuffer( nData, true );
        }
      }

      // set new meta data for property
      property.capturePoints = 20;
      property.owner = selectedUnit.owner;
    }

    controller.invokeCommand( data, "wait" );
  }

});