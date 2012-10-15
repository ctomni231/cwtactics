cwt.defineLayer( CWT_LAYER_DATA_ACCESS, function( data, model, sheets, util ){

  var moveCheck = function( tx, ty, mvp, mType, checkMap, player,
                                              getTileVal, setTileVal ){

    var cost = data.moveCosts( mType, model.map[ tx ][ ty ] );
    if( cost != 0 ){

      // TODO SUPPORT MOVE THROUGH ALLIED AND OWN UNITS
      var unit = data.unitByPos( tx, ty );
      if( unit !== null && data.player(unit.owner).team !== player.team ){
        return; }

      var rest = mvp-cost;
      if( rest >= 0 ){

        if( getTileVal( tx,ty ) < rest ){

          // ADD TO TO CHECK MAP
          checkMap.push( [ tx, ty, rest ] );

          // ADD TO MOVE MAP
          setTileVal( tx,ty, rest );

          // NEGATIVE COSTS MEANS SAME COSTS BUT NOT USABLE AS TARGET
          //if( unit !== null && cwt.data.player(unit.owner).team === player.team ){
          // movemap[ tx ][ ty ] = -rest; }
        }
      }
    }
  };


  // ###################### PUBLIC API ################################
  // ##################################################################

  /** integer code of the move up command
   * @constant
   */
  data.MOVE_CODE_UP    = 0;

  /** integer code of the move right command
   * @constant
   */
  data.MOVE_CODE_RIGHT = 1;

  /** integer code of the move down command
   * @constant
   */
  data.MOVE_CODE_DOWN  = 2;

  /** integer code of the move left command
   * @constant
   */
  data.MOVE_CODE_LEFT  = 3;

  /**
   * Returns the costs for a movetype to move onto a tile type.
   *
   * @param movetype
   * @param tiletype
   */
  data.moveCosts = function( movetype, tiletype ){
    var c;

    // search id
    c = movetype.costs[ tiletype ];

    if( c === undefined ) c = movetype.costs["*"];

    return c;
  };

  /**
   * Is a way blocked if an unit of an owner want to move to a given position?
   *
   * @param x
   * @param y
   * @param owner
   * @private
   */
  data.isWayBlocked = function( x,y, owner, lastTile ){

    // CHECK CURRENT POSITION
    var unit = data.unitByPos(x,y);
    if( unit !== null ){

      if( unit.owner === owner ){
/*
        if( lastTile &&
          cwt._transportRelation[ cwt.extractUnitId( unit ) ] === undefined ){
          // TODO make it better later

          // THAT IS A FAULT
          cwt.error("cannot move onto a tile that is occupied by an own unit");
        }
        */

        // ELSE MOVE THROUGH IT :P
      }
      else if( data.player(unit.owner).team === data.player(owner).team ){

        if( lastTile ){

          // THAT IS A FAULT
          util.logError(
            "cannot move onto a tile that is occupied by an allied unit"
          );
        }
        // ELSE MOVE THROUGH IT :P
      }
      else{

        // ENEMY UNIT
        return true;
      }
    }

    return false;
  };
  
  /**
   * Sets the move map with the movecosts in a table ( array of arrays ).
   *
   */
  data.prepareMovepathSelection = function( uid, getTileVal, setTileVal ){
    
    var unit   = data.unitById( uid );
    var type   = data.unitSheet( unit.type );
    var mType  = data.movetypeSheet( type.moveType );
    var player = data.player( unit.owner );
    var range  = type.moveRange;
    var x = unit.x;
    var y = unit.y;

    // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
    if( unit.fuel < range ) range = unit.fuel;
  
    // ADD START TILE TO MAP
    setTileVal( x, y, range );
  
    // BUILD MOVE MAP
    var tile, cost, rest;
    var needsCheck = [ [ x, y, range ] ]; //TODO REFA -> FLAT ARRAY
    while( needsCheck.length > 0 ){
  
      // GET NEXT TILE
      tile = needsCheck[ 0 ];
      needsCheck.splice(0,1);
  
      // UP
      if( tile[1] > 0 )
        moveCheck( tile[0], tile[1]-1, tile[2], mType, needsCheck, player,
          getTileVal, setTileVal );
  
      // RIGHT
      if( tile[0] < model.mapWidth-1 )
        moveCheck( tile[0]+1, tile[1], tile[2], mType, needsCheck, player,
          getTileVal, setTileVal  );
  
      // DOWN
      if( tile[1] < model.mapHeight-1 )
        moveCheck( tile[0], tile[1]+1, tile[2], mType, needsCheck, player,
          getTileVal, setTileVal  );
  
      // LEFT
      if( tile[0] > 0 )
        moveCheck( tile[0]-1, tile[1], tile[2], mType, needsCheck, player,
          getTileVal, setTileVal  );
    }
  
    // CONVERT LEFT MOVE POINTS TO COST POINTS
    var moveMapDim = CWT_MAX_MOVE_RANGE*2+1;
    for( var x=0,xe=moveMapDim; x<xe; x++ ){
      for( var y=0,ye=moveMapDim; y<ye; y++ ){
  
        if( getTileVal(x,y) !== -1 ){

          var cost = data.moveCosts( mType, model.map[x][y] );
          setTileVal(x,y,cost);
        }
      }
    }
  };

  /**
   * Moves an unit from A to B with a given path.
   *
   * @param uid unit identical number
   * @param sx x coordinate of the start point
   * @param sy y coordinate of the start point
   * @param way array of move codes
   */
  data.moveUnitFromAtoB = function( uid, sx, sy, way ){

    var cX = sx;
    var cY = sy;
    var unit = data.unitById( uid );
    var uType = data.unitSheet( unit.type );
    var mType = data.movetypeSheet( uType.moveType );

    // CHECK MOVE WAY END
    var lastIndex = way.length-1;
    var fuelUsed = 0;
    for( var i=0,e=way.length; i<e; i++ ){

      // GET NEW CURRENT POSITION
      switch( way[i] ){

        case data.MOVE_CODE_UP:
          if( cY === 0 ) util.logError(
            "cannot do move command UP because",
            "current position is at the border"
          );
          cY--;
          break;

        case data.MOVE_CODE_RIGHT:
          if( cX === model.mapWidth-1 ) util.logError(
            "cannot do move command RIGHT because",
            "current position is at the border"
          );
          cX++;
          break;

        case data.MOVE_CODE_DOWN:
          if( cY === model.mapHeight-1 )util.logError(
            "cannot do move command DOWN because",
            "current position is at the border"
          );
          cY++;
          break;

        case data.MOVE_CODE_LEFT:
          if( cX === 0 ) util.logError(
            "cannot do move command LEFT because",
            "current position is at the border"
          );
          cX--;
          break;

        default: util.logError("unknown command ",way[i]);
      }

      // IS WAY BLOCKED ?
      if( data.isWayBlocked( cX, cY, unit.owner, i == e-1 ) ){

        lastIndex = i-1;

        // GP BACK
        switch( way[i] ){

          case data.MOVE_CODE_UP:
            cY++;
            break;

          case data.MOVE_CODE_RIGHT:
            cX--;
            break;

          case data.MOVE_CODE_DOWN:
            cY--;
            break;

          case data.MOVE_CODE_LEFT:
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
      fuelUsed += data.moveCosts( mType, model.map[cX][cY] );
    }

    unit.fuel -= fuelUsed;
    data.setUnitPosition( uid, cX, cY );

    if( util.DEBUG ){
      util.logInfo(
        "moved unit",uid,
        "from (",sx,",",sy,")",
        "to (",cX,",",cY,")"
      );
    }
  };

});