controller.registerCommand({

  key: "move",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    var way = data.getMovePath();
    var uid = data.getSourceUnitId();

    var cX = data.getSourceX();
    var cY = data.getSourceY();
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


        if( lastIndex == -1 ){

          // THAT IS A FAULT
          cwt.error(
            "unit is blocked by an enemy, but the enemy",
            "stands beside the start tile, that is a logic fault!"
          );
        }

        break;
      }

      // INCREASE FUEL USAGE
      fuelUsed += model.moveCosts( mType, model.map[cX][cY] );
    }

    unit.fuel -= fuelUsed;

    // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN)
    // SOMEWHERE
    if( unit.x !== -1 && unit.y !== -1 ){
      model.eraseUnitPosition( uid );
    }

    // DO NOT SET NEW POSITION IF THE POSITION IS OCCUPIED
    // THE SET POSITION LOGIC MUST BE DONE BY THE ACTION
    if( model.unitPosMap[cX][cY] === null ){
      model.setUnitPosition( uid, cX, cY );
    }

    if( DEBUG ){
      util.logInfo(
        "moved unit",uid,
        "from (",data.getSourceX(),",",data.getSourceY(),")",
        "to (",cX,",",cY,")"
      );
    }
  }

})