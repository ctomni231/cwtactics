controller.engineAction({

  name: "moveUnit",

  key: "MOVE",

  shared: true,

  createDataSet: function( data ){
    return [ data.cloneMovepath(), data.sourceUnitId, data.sourceX, data.sourceY ];
  },
  
  /**
   * Moves an unit from A to B.
   *
   * @param {Array} way move path of the unit
   * @param {Number} uid moving unit id 
   * @param {Number} x x coordinate of the source
   * @param {Number} y y coordinate of the source
   *
   * @methodOf controller.actions
   * @name moveUnit
   */
  action: function( way, uid, x,y ){
    var cX = x;
    var cY = y;
    var unit = model.units[ uid ];
    var uType = model.sheets.unitSheets[ unit.type ];
    var mType = model.sheets.movetypeSheets[ uType.moveType ];

    // CHECK MOVE WAY END
    var lastIndex = way.length-1;
    var fuelUsed = 0;
    for( var i=0,e=way.length; i<e; i++ ){

      // GET NEW CURRENT POSITION
      switch( way[i] ){

        case model.MOVE_CODE_UP:
          if( cY === 0 ) util.logError(
            "cannot do move command UP because",
            "current position is at the border"
          );
          cY--;
          break;

        case model.MOVE_CODE_RIGHT:
          if( cX === model.mapWidth-1 ) util.logError(
            "cannot do move command RIGHT because",
            "current position is at the border"
          );
          cX++;
          break;

        case model.MOVE_CODE_DOWN:
          if( cY === model.mapHeight-1 )util.logError(
            "cannot do move command DOWN because",
            "current position is at the border"
          );
          cY++;
          break;

        case model.MOVE_CODE_LEFT:
          if( cX === 0 ) util.logError(
            "cannot do move command LEFT because",
            "current position is at the border"
          );
          cX--;
          break;

        default: util.logError("unknown command ",way[i]);
      }

      // IS WAY BLOCKED ? TODO
      if( false && model.isWayBlocked( cX, cY, unit.owner, i == e-1 ) ){

        lastIndex = i-1;

        // GP BACK
        switch( way[i] ){

          case model.MOVE_CODE_UP:
            cY++;
            break;

          case model.MOVE_CODE_RIGHT:
            cX--;
            break;

          case model.MOVE_CODE_DOWN:
            cY--;
            break;

          case model.MOVE_CODE_LEFT:
            cX++;
            break;
        }


        if( lastIndex === -1 ){

          // THAT IS A FAULT
          util.raiseError( "unit is blocked by an enemy, but the enemy stands beside the start tile, that is a logic fault!" );
        }

        break;
      }

      // INCREASE FUEL USAGE
      fuelUsed += model.moveCosts( mType, model.map[cX][cY], model.weather.ID );
    }

    unit.fuel -= fuelUsed;
    
    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN)
    // SOMEWHERE
    if( unit.x !== -1 && unit.y !== -1 ){
      model.unitPosMap[ unit.x ][ unit.y ] = null;
      
      // controller.actions.removeVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
      controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "RVIS" );
      
      unit.x = -1;
      unit.y = -1;
    }

    // DO NOT SET NEW POSITION IF THE POSITION IS OCCUPIED
    // THE SET POSITION LOGIC MUST BE DONE BY THE ACTION
    if( model.unitPosMap[cX][cY] === null ){
      unit.x = cX;
      unit.y = cY;
      model.unitPosMap[ cX ][ cY ] = unit;
      //controller.actions.addVision(  cX, cY, model.sheets.unitSheets[ unit.type ].vision );
      controller.pushAction( cX,cY, model.sheets.unitSheets[ unit.type ].vision, "AVIS" );
    }

    if( DEBUG ){
      util.log( "moved unit",uid,"from (",x,",",y,") to (",cX,",",cY,")" );
    }
  }

})