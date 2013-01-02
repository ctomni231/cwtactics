/**
 * Code of the move up command
 * @constant
 */
model.MOVE_CODE_UP    = 0;

/**
 * Code of the move right command
 * @constant
 */
model.MOVE_CODE_RIGHT = 1;

/**
 * Code of the move down command
 * @constant
 */
model.MOVE_CODE_DOWN  = 2;

/**
 * Code of the move left command
 * @constant
 */
model.MOVE_CODE_LEFT  = 3;

/**
 *
 * @param selectData
 * @param actionData
 */
model.fillMoveMap = function( selectData, actionData ){
  var unit   = actionData.getSourceUnit();
  var type   = model.sheets.unitSheets[unit.type];
  var mType  = model.sheets.movetypeSheets[ type.moveType ];
  var player = model.players[unit.owner];
  var range  = type.moveRange;
  var x = actionData.getSourceX();
  var y = actionData.getSourceY();

  // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
  if( unit.fuel < range ) range = unit.fuel;

  // ADD START TILE TO MAP
  selectData.cleanIt( CWT_INACTIVE_ID, x,y );
  selectData.setPositionValue( x,y,range );

  // FILL MAP ( ONE STRUCT IS X;Y;LEFT_POINTS )
  var toBeChecked = [ x,y,range ];
  var checker = [
    -1,-1,
    -1,-1,
    -1,-1,
    -1,-1
  ];

  while( true ){
    var cHigh      = -1;
    var cHighIndex = -1;

    for( var i=0,e=toBeChecked.length; i<e; i+=3 ){
      var leftPoints = toBeChecked[i+2];

      if( leftPoints !== undefined && leftPoints !== null ){
        if( cHigh === -1 || leftPoints > cHigh ){
          cHigh = leftPoints;
          cHighIndex = i;
        }
      }
    }
    if( cHighIndex === -1 ) break;

    var cx = toBeChecked[cHighIndex];
    var cy = toBeChecked[cHighIndex+1];
    var cp = toBeChecked[cHighIndex+2];

    // CLEAR
    toBeChecked[cHighIndex  ] = null;
    toBeChecked[cHighIndex+1] = null;
    toBeChecked[cHighIndex+2] = null;

    // SET NEIGHTBOURS
    if(cx>0                 ){ checker[0] = cx-1; checker[1] = cy; }
    else{                      checker[0] = -1  ; checker[1] = -1; }
    if(cx<model.mapWidth-1  ){ checker[2] = cx+1; checker[3] = cy; }
    else{                      checker[2] = -1  ; checker[3] = -1; }
    if(cy>0                 ){ checker[4] = cx; checker[5] = cy-1; }
    else{                      checker[4] = -1; checker[5] = -1;   }
    if(cy<model.mapHeight-1 ){ checker[6] = cx; checker[7] = cy+1; }
    else{                      checker[6] = -1; checker[7] = -1;   }

    // CHECK NEIGHBOURS
    for( var n=0; n<8; n += 2 ){
      if( checker[n] === -1 ) continue;

      var tx = checker[n  ];
      var ty = checker[n+1];

      var cost = model.moveCosts( mType, model.map[ tx ][ ty ] );
      if( cost !== 0 ){

        var cunit = model.unitPosMap[tx][ty];
        if( cunit !== null &&
          model.players[cunit.owner].team !== player.team ){
          continue;
        }

        var rest = cp-cost;
        if( rest >= 0 &&
          rest > selectData.getPositionValue(tx,ty) ){

          // ADD TO MOVE MAP
          selectData.setPositionValue( tx,ty,rest );

          // ADD TO CHECKER
          for( var i=0,e=toBeChecked.length; i<=e; i+=3 ){
            if( toBeChecked[i] === null ||i===e ){
              toBeChecked[i  ] = tx;
              toBeChecked[i+1] = ty;
              toBeChecked[i+2] = rest;
              break;
            }
          }
        }
      }
    }
  }

  // CONVERT LEFT POINTS TO MOVE COSTS
  for( var x=0,xe=model.mapWidth; x<xe; x++ ){
    for( var y=0,ye=model.mapHeight; y<ye; y++ ){
      if( selectData.getPositionValue(x,y) !== -1 ){
        var cost = model.moveCosts( mType, model.map[x][y] );
        selectData.setPositionValue( x, y, cost );
      }
    }
  }
};

/**
 *
 * @param selectData
 * @param actionData
 * @param tx
 * @param ty
 * @param code
 */
model.addCodeToPath = function( selectData, actionData, tx, ty, code ){
  var fuelLeft = actionData.getSourceUnit().fuel;
  var fuelUsed = 0;
  var movePath = actionData.getMovePath();
  movePath.push( code );
  var points =  model.sheets.unitSheets[
    actionData.getSourceUnit().type
  ].moveRange;

  if( fuelLeft < points ) points = fuelLeft;

  var cx = actionData.getSourceX();
  var cy = actionData.getSourceY();
  for( var i=0,e=movePath.length; i<e; i++ ){

    switch( movePath[i] ){
      case model.MOVE_CODE_UP: cy--; break;
      case model.MOVE_CODE_DOWN: cy++; break;
      case model.MOVE_CODE_LEFT: cx--; break;
      case model.MOVE_CODE_RIGHT: cx++; break;
      default : util.illegalArgumentError();
    }

    fuelUsed += selectData.getPositionValue(cx,cy);
  }

  // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
  if( fuelUsed > points ){
    model.setPathByRecalculation( selectData, actionData, tx,ty );
  }
};

/**
 *
 * @param selectData
 * @param actionData
 * @param tx
 * @param ty
 */
model.setPathByRecalculation = function( selectData, actionData, tx,ty ){
  var stx = actionData.getSourceX( );
  var sty = actionData.getSourceY( );
  var movePath = actionData.getMovePath();

  if ( DEBUG ) util.logInfo(
    "searching path from",
    "(", stx, ",", sty, ")",
    "to",
    "(", tx, ",", ty, ")"
  );

  // var graph = new Graph( nodes );
  var graph = new Graph( selectData.getDataMatrix() );

  var dsx = stx - selectData.getCenterX( );
  var dsy = sty - selectData.getCenterY( );
  var start = graph.nodes[ dsx ][ dsy ];

  var dtx = tx - selectData.getCenterX( );
  var dty = ty - selectData.getCenterY( );
  var end = graph.nodes[ dtx ][ dty ];

  var path = astar.search(graph.nodes, start, end);

  if ( DEBUG ){
    util.logInfo("calculated way is", path);
  }

  var codesPath = [];
  var cx = stx;
  var cy = sty;
  var cNode;

  for (var i = 0, e = path.length; i < e; i++) {
    cNode = path[i];

    var dir;
    if (cNode.x > cx) dir = model.MOVE_CODE_RIGHT;
    if (cNode.x < cx) dir = model.MOVE_CODE_LEFT;
    if (cNode.y > cy) dir = model.MOVE_CODE_DOWN;
    if (cNode.y < cy) dir = model.MOVE_CODE_UP;

    if (dir === undefined) throw Error();

    codesPath.push(dir);

    cx = cNode.x;
    cy = cNode.y;
  }

  movePath.splice(0);
  for( var i=0,e=codesPath.length; i<e; i++ ){
    movePath[i] = codesPath[i];
  }
};