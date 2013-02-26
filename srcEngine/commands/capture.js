controller.userAction({
  
  name:"captureProperty",

  key:"CTPR",
  
  unitAction: true,
  
  condition: function( mem ){
    return (
      mem.targetProperty !== null && 
      model.turnOwner !== mem.targetProperty.owner &&

      ( mem.targetUnit === null || mem.targetUnit === mem.sourceUnit ) &&

      model.sheets.tileSheets[ mem.targetProperty.type ].capturePoints > 0 &&
      model.sheets.unitSheets[ mem.sourceUnit.type ].captures > 0
    );
  },
  
  createDataSet: function( mem ){
    
    // ONE POINT FOR EVERY 10 HP STARTING WITH 9
    var points = parseInt( mem.sourceUnit.hp/10, 10 ) +1;
    
    return [
      mem.sourceUnitId,
      mem.targetPropertyId,
      mem.targetX,
      mem.targetY,
      points
    ];
  },
  
  /**
   * Captures a property.
   *
   * @param {Number} cid capturer id
   * @param {Number} prid property id
   * @param {Number} px x coordinate
   * @param {Number} py y coordinate
   * @param {Number} points capture points
   *
   * @methodOf controller.actions
   * @name captureProperty
   */
  action: function( cid, prid, px,py, points ){
    var selectedUnit = model.units[cid];
    var property = model.properties[prid];
    var unitSh = model.sheets.unitSheets[ selectedUnit.type ];

    selectedUnit.ST_CAPTURES = true;
    
    property.capturePoints -= points;
    if( property.capturePoints <= 0 ){
      var x = px;
      var y = py;

      if( DEBUG ){
        util.logInfo( "property at (",x,",",y,") captured");
      }

      // ADD VISION
      controller.actions.addVision( x,y, model.sheets.tileSheets[property.type].vision );

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
          controller.pushSharedAction("endGame");
        }
      }

      // set new meta data for property
      property.capturePoints = 20;
      property.owner = selectedUnit.owner;

      var capLimit = model.rules.captureWinLimit;
      if( capLimit !== 0 && capLimit <= model.countProperties() ){
        controller.pushSharedAction("endGame");
      }
    }

    controller.actions.wait( cid );
  }
  
});