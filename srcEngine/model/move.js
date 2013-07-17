// # Move Module
//

// ### Meta Data

controller.registerInvokableCommand( "setUnitPosition" );
controller.registerInvokableCommand( "clearUnitPosition" );
controller.registerInvokableCommand( "moveUnit" );

controller.defineEvent( "setUnitPosition" );
controller.defineEvent( "clearUnitPosition" );
controller.defineEvent( "moveUnit" );

controller.defineGameScriptable( "moverange", 1, constants.MAX_SELECTION_RANGE );
controller.defineGameScriptable( "movecost", 1, constants.MAX_SELECTION_RANGE );

model.moveTypeParser.addHandler( function( sheet ){
  if( !util.expectObject( sheet, "costs", true ) ) return false;

  var costs = sheet.costs;
  var costsKeys = Object.keys( costs );
  for( var i1 = 0, e1 = costsKeys.length; i1 < e1; i1++ ) {
    if( !util.expectNumber( costs, costsKeys[i1], true, true, -1, constants.MAX_SELECTION_RANGE ) ) return false;
    if( !util.not( costs, costsKeys[i1], 0 ) ) return false;
  }
} );

// ---

// ### Logic

// Possible move codes.
//
model.moveCodes = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3
};

// Moves an unit from one position to another position.
// 
// @param {Array} way move way
// @param {Number} uid id of the moving unit
// @param {Number} x x coordinate of the source
// @param {Number} y y coordinate of the source
// @param {Boolean} noFuelConsumption if true then fuel won't be decreases
//
model.moveUnit = function( way, uid, x, y, noFuelConsumption ){
  var cX = x;
  var cY = y;
  var unit = model.units[ uid ];
  var uType = unit.type;
  var mType = model.moveTypes[ uType.movetype ];
  var wayIsIllegal = false;
  var lastIndex = way.length - 1;
  var fuelUsed = 0;

  // check move way by iterate through all move codes and build the path
  //
  // 1. check the correctness of the given move code
  // 2. check all tiles to recognize trapped moves
  // 3. accumulate fuel consumption ( expcept `noFuelConsumption` is `true` )
  //
  for( var i = 0, e = way.length; i < e; i++ ) {

    // set current position by current move code
    switch(way[i]) {

      case model.moveCodes.UP:
        if( cY === 0 ) wayIsIllegal = true;
        cY--;
        break;

      case model.moveCodes.RIGHT:
        if( cX === model.mapWidth - 1 ) wayIsIllegal = true;
        cX++;
        break;

      case model.moveCodes.DOWN:
        if( cY === model.mapHeight - 1 ) wayIsIllegal = true;
        cY++;
        break;

      case model.moveCodes.LEFT:
        if( cX === 0 ) wayIsIllegal = true;
        cX--;
        break;

      default:
        break;
    }

    // when the way contains an illegal value that isn't part of `model.moveCodes` then break 
    // the move process.
    if( !wayIsIllegal ) model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.ILLEGAL_MOVE_PATH );

    // is way blocked ? (niy!)
    if( false && model.isWayBlocked( cX, cY, unit.owner, (i === e - 1) ) ) {

      lastIndex = i - 1;

      // go back until you find a valid tile
      switch(way[i]) {
        case model.moveCodes.UP:
          cY++;
          break;
        case model.moveCodes.RIGHT:
          cX--;
          break;
        case model.moveCodes.DOWN:
          cY--;
          break;
        case model.moveCodes.LEFT:
          cX++;
          break;
      }

      // this is normally not possible, except other modules makes a fault in this case the moving system could not 
      // recognize a enemy in front of the mover that causes a `trap`
      if( lastIndex === -1 ) {
        model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.ILLEGAL_MOVE_ENEMY_IS_NEIGHTBOR );
      }

      break;
    }

    // calculate the used fuel to move onto the current tile
    // if `noFuelConsumption` is not `true` some actions like unloading does not consume fuel
    if( noFuelConsumption ) fuelUsed += model.moveCosts( mType, cX, cY );
  }

  // consume fuel ( if `noFuelConsumption` is `true` then the costs will be `0` )
  unit.fuel -= fuelUsed;
  if( unit.fuel < 0 ) model.criticalError( constants.error.ILLEGAL_DATA, constants.error.NOT_ENOUGH_FUEL );

  // DO NOT ERASE POSITION IF UNIT WAS LOADED OR HIDDEN (NOT INGAME HIDDEN) SOMEWHERE
  if( unit.x >= 0 && unit.y >= 0 ) {

    // RESET CAPTURE POINTS
    var prop = model.propertyPosMap[unit.x][unit.y];
    if( prop ) model.resetCapturePoints( model.extractPropertyId( prop ) );

    model.clearUnitPosition( uid );
  }

  // do not set the new position if the position is already occupied 
  // the action logic must take care of this situation
  if( model.unitPosMap[cX][cY] === null ) model.setUnitPosition( uid, cX, cY );
  
  // Invoke event
  var evCb = controller.events.moveUnit;
  if( evCb ) evCb(uid);
};

// Removes an unit from a position.
// 
// @param {Number} uid id number of the target unit
// @param {Number} x x coordinate
// @param {Number} y y coordinate
// 
model.clearUnitPosition = function( uid ){
  var unit = model.units[uid];

  var x = unit.x;
  var y = unit.y;

  model.modifyVisionAt( x, y, unit.owner, unit.type.vision, -1 );

  model.unitPosMap[x][y] = null;
  unit.x = -unit.x;
  unit.y = -unit.y;
  
  // Invoke event
  var evCb = controller.events.clearUnitPosition;
  if(evCb)evCb(uid);
};

// Sets the position of an unit.
// 
// @param {Number} uid id number of the target unit
// @param {Number} x x coordinate
// @param {Number} y y coordinate
//
model.setUnitPosition = function( uid, x, y ){
  var unit = model.units[uid];

  unit.x = x;
  unit.y = y;
  model.unitPosMap[x][y] = unit;

  model.modifyVisionAt( x, y, unit.owner, unit.type.vision, 1 );

  // Invoke event
  var evCb = controller.events.setUnitPosition;
  if( evCb ) evCb( uid, x, y );
};

// Returns the movecosts to move with a given move type on a given tile type.
// 
// @param {model.moveType} movetype
// @returns {Number} move costs or -1 if unmovable
// 
model.moveCosts = function( movetype, x, y ){
  var v;
  var type = model.map[x][y];

  // check unit type id first
  v = movetype.costs[type.ID];
  if( typeof v === "number" ) return v;

  // check move type id after that
  v = movetype.costs[type.movetype];
  if( typeof v === "number" ) return v;

  // try wildcard at last
  v = movetype.costs["*"];
  if( typeof v === "number" ) return v;

  // no match then return `-1`as not move able
  return -1;
};

// Extracts the move code between two positions.
//
//  @param {type} sx source x coordinate
//  @param {type} sy source y coordinate
//  @param {type} tx target x coordinate
//  @param {type} ty target y coordinate
//  @returns {entry of model.moveCodes}
//
model.moveCodeFromAtoB = function( sx, sy, tx, ty ){
  if( model.distance( sx, sy, tx, ty ) > 1 ) {
    model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.POSITIONS_SHOULD_BE_NEIGHBORS );
  }

  if( sx < tx ) return model.moveCodes.RIGHT;
  if( sx > tx ) return model.moveCodes.LEFT;
  if( sy < ty ) return model.moveCodes.DOWN;
  if( sy > ty ) return model.moveCodes.UP;

  // this situation should not be possible normally
  model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.UNKNOWN );
};

// Generates a path from a start position { `stx` , `sty` } to { `tx` , `ty` } with a 
// given selection ( `util.selectionMap` ) map. The result will be stored 
// in the `movePath`.
//
model.generatePath = function( stx, sty, tx, ty, selection, movePath ){
  var graph = new Graph( selection.data );

  var dsx = stx - selection.centerX;
  var dsy = sty - selection.centerY;
  var start = graph.nodes[ dsx ][ dsy ];

  var dtx = tx - selection.centerX;
  var dty = ty - selection.centerY;
  var end = graph.nodes[ dtx ][ dty ];

  var path = astar.search( graph.nodes, start, end );

  var cx = stx;
  var cy = sty;
  var cNode;

  movePath.resetValues();
  var movePathIndex = 0;
  for( var i = 0, e = path.length; i < e; i++ ) {
    cNode = path[i];

    var dir;
    if( cNode.x > cx ) dir = model.moveCodes.RIGHT;
    else if( cNode.x < cx ) dir = model.moveCodes.LEFT;
    else if( cNode.y > cy ) dir = model.moveCodes.DOWN;
    else if( cNode.y < cy ) dir = model.moveCodes.UP;
    else model.criticalError( constants.error.ILLEGAL_DATA, constants.error.ILLEGAL_MOVE_CODE );

    // add code to move path
    movePath[movePathIndex] = dir;
    movePathIndex++;

    cx = cNode.x;
    cy = cNode.y;
  }
};

// Appends a move `code` to a given `movePath` and returns `true` if the insertion was possible else 
// `false`. If the new code is a backwards move to the previous tile in the path then the actual last tile will be 
// dropped. In this function returns also `true` in this case.
//
model.addMoveCodeToPath = function( code, movePath ){

  // is the move a go back to the last tile ?
  var lastCode = movePath.getLastCode();
  var goBackCode;
  switch(code) {
    
    case model.moveCodes.UP:
      goBackCode = model.moveCodes.DOWN;
      break;
      
    case model.moveCodes.DOWN:
      goBackCode = model.moveCodes.UP;
      break;
      
    case model.moveCodes.LEFT:
      goBackCode = model.moveCodes.RIGHT;
      break;
      
    case model.moveCodes.RIGHT:
      goBackCode = model.moveCodes.LEFT;
      break;
      
    default :
      model.criticalError( constants.error.ILLEGAL_DATA, constants.error.ILLEGAL_MOVE_PATH );
  }

  // if move is a go back then pop the lest code
  if( lastCode === goBackCode ) {
    movePath[ movePath.getSize() - 1 ] = constants.INACTIVE_ID;
    return true;
  }

  var source = controller.stateMachine.data.source;
  var unit = source.unit;
  var fuelLeft = unit.fuel;
  var fuelUsed = 0;
  var points = unit.type.range;
  if( fuelLeft < points ) points = fuelLeft;

  // add command to the move path list
  movePath[ movePath.getSize() ] = code;

  // calculate fuel consumption for the current move path
  var cx = source.x;
  var cy = source.y;
  for( var i = 0, e = getSize(); i < e; i++ ) {
    switch(movePath[i]) {
      
      case model.moveCodes.UP:
        cy--;
        break;
        
      case model.moveCodes.DOWN:
        cy++;
        break;
        
      case model.moveCodes.LEFT:
        cx--;
        break;
        
      case model.moveCodes.RIGHT:
        cx++;
        break;
        
      default :
        model.criticalError( constants.error.ILLEGAL_DATA, constants.error.ILLEGAL_MOVE_CODE );
    }

    // acc. fuel consumption
    fuelUsed += controller.stateMachine.data.selection.getValueAt( cx, cy );
  }

  // if to much fuel would be needed then decline
  if( fuelUsed > points ){
    movePath[ movePath.getSize() - 1 ] = constants.INACTIVE_ID; // remove the code that you placed before
    return false;
  }
  else return true;
};

// ### model.fillMoveMapHelper
// 
// Little helper array object for `model.fillMoveMap`. This will be used only by one process. If the helper is 
// not available then a temp object will be created in `model.fillMoveMap`. If the engine is used without client
// hacking then this situation never happen and the `model.fillMoveMap` will use this helper to prevent unnecessary
// array creation.
//
model.fillMoveMapHelper = [ ];

// ### fillMoveMap
// 
// Fills a move map for possible move able tiles in a selection map.
// 
model.fillMoveMap = function( source, selection, x, y, unit ){

  // grab object data from `source` position if no explicit data is given
  if( typeof x !== "number" ) x = source.x;
  if( typeof y !== "number" ) y = source.y;
  if( !unit ) unit = source.unit;

  var toBeChecked;
  var releaseHelper = false;
  if( model.fillMoveMapHelper !== null ) {
    toBeChecked = model.fillMoveMapHelper;
    model.fillMoveMapHelper = null;
    releaseHelper = true;
  }
  else toBeChecked = [ ];


  var mType = model.moveTypes[ unit.type.movetype ];
  var player = model.players[unit.owner];

  controller.prepareTags( x, y, model.extractUnitId( unit ) );
  var range = controller.scriptedValue( unit.owner, "moverange", unit.type.range );

  // decrease range if not enough fuel is available
  if( unit.fuel < range ) range = unit.fuel;

  // add start tile to the map
  selection.setCenter( x, y, this.ILLEGAL_MOVE_FIELD );
  selection.setValueAt( x, y, range );

  // fill map ( one struct is X;Y;LEFT_POINTS )
  toBeChecked[0] = x;
  toBeChecked[1] = y;
  toBeChecked[2] = range;

  var checker = [
    -1, -1,
    -1, -1,
    -1, -1,
    -1, -1
  ];

  while(true) {
    var cHigh = -1;
    var cHighIndex = -1;

    for( var i = 0, e = toBeChecked.length; i < e; i += 3 ) {
      var leftPoints = toBeChecked[i + 2];

      if( leftPoints !== undefined && leftPoints !== null ) {
        if( cHigh === -1 || leftPoints > cHigh ) {
          cHigh = leftPoints;
          cHighIndex = i;
        }
      }
    }
    if( cHighIndex === -1 ) break;

    var cx = toBeChecked[cHighIndex];
    var cy = toBeChecked[cHighIndex + 1];
    var cp = toBeChecked[cHighIndex + 2];

    // clear
    toBeChecked[cHighIndex  ] = null;
    toBeChecked[cHighIndex + 1] = null;
    toBeChecked[cHighIndex + 2] = null;

    // set neighbors for check
    if( cx > 0 ) {
      checker[0] = cx - 1;
      checker[1] = cy;
    }
    else {
      checker[0] = -1;
      checker[1] = -1;
    }
    if( cx < model.mapWidth - 1 ) {
      checker[2] = cx + 1;
      checker[3] = cy;
    }
    else {
      checker[2] = -1;
      checker[3] = -1;
    }
    if( cy > 0 ) {
      checker[4] = cx;
      checker[5] = cy - 1;
    }
    else {
      checker[4] = -1;
      checker[5] = -1;
    }
    if( cy < model.mapHeight - 1 ) {
      checker[6] = cx;
      checker[7] = cy + 1;
    }
    else {
      checker[6] = -1;
      checker[7] = -1;
    }

    // check the given neighbors for move
    for( var n = 0; n < 8; n += 2 ) {
      if( checker[n] === -1 ) continue;

      var tx = checker[n  ];
      var ty = checker[n + 1];

      var cost = model.moveCosts( mType, tx, ty );
      if( cost !== -1 ) {

        var cunit = model.unitPosMap[tx][ty];
        if( cunit !== null && model.fogData[tx][ty] > 0 && !cunit.hidden && model.players[cunit.owner].team !== player.team ) {
          continue;
        }

        var rest = cp - cost;
        if( rest >= 0 && rest > selection.getValueAt( tx, ty ) ) {

          // add possible move to the `selection` map
          selection.setValueAt( tx, ty, rest );

          // add this tile to the checker 
          for( var i = 0, e = toBeChecked.length; i <= e; i += 3 ) {
            if( toBeChecked[i] === null || i === e ) {
              toBeChecked[i  ] = tx;
              toBeChecked[i + 1] = ty;
              toBeChecked[i + 2] = rest;
              break;
            }
          }
        }
      }
    }
  }

  // release helper if you grabbed it
  if( releaseHelper ) {
    for( var hi = 0, he = toBeChecked.length; hi < he; hi++ ) toBeChecked[hi] = null;
    model.fillMoveMapHelper = toBeChecked;
  }

  // convert left points back to absolute costs
  for( x = 0, xe = model.mapWidth; x < xe; x++ ) {
    for( y = 0, ye = model.mapHeight; y < ye; y++ ) {
      if( selection.getValueAt( x, y ) !== constants.INACTIVE_ID ) {

        cost = model.moveCosts( mType, x, y );
        selection.setValueAt( x, y, cost );
      }
    }
  }
};