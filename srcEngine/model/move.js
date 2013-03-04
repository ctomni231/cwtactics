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
 * Injects movable tiles into a action data memory object.
 * 
 * @param data action data memory
 */
model.fillMoveMap = function( data ){
  var unit   = data.sourceUnit;
  var type   = model.sheets.unitSheets[unit.type];
  var mType  = model.sheets.movetypeSheets[ type.moveType ];
  var player = model.players[unit.owner];
  var range  = type.moveRange;
  var x = data.sourceX;
  var y = data.sourceY;
  var wth = model.weather.ID;
  
  // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
  if( unit.fuel < range ) range = unit.fuel;

  // ADD START TILE TO MAP
  data.setSelectionCenter( x,y,CWT_INACTIVE_ID );
  data.setSelectionValueAt( x,y,range );

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

      var cost = model.moveCosts( mType, model.map[ tx ][ ty ], wth );
      if( cost !== 0 ){

        var cunit = model.unitPosMap[tx][ty];
        if( cunit !== null &&
            model.fogData[tx][ty] > 0 &&
            !cunit.hidden &&
            model.players[cunit.owner].team !== player.team ){
          continue;
        }

        var rest = cp-cost;
        if( rest >= 0 &&
          rest > data.getSelectionValueAt(tx,ty) ){

          // ADD TO MOVE MAP
          data.setSelectionValueAt( tx,ty,rest );

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
      if( data.getSelectionValueAt(x,y) !== -1 ){
        var cost = model.moveCosts( mType, model.map[x][y], wth );
        data.setSelectionValueAt( x, y, cost );
      }
    }
  }
};

/**
 * Appends a tile to the move path of a given action data memory object.
 *
 * @param data action data memory
 * @param tx target x coordinate
 * @param ty target y coordinate
 * @param code move code to the next tile
 */
model.addCodeToPath = function( data, tx, ty, code ){
  var fuelLeft = data.sourceUnit.fuel;
  var fuelUsed = 0; 
  var movePath = data.movePath;
  movePath.push( code );
  var points =  model.sheets.unitSheets[ data.sourceUnit.type ].moveRange;

  if( fuelLeft < points ) points = fuelLeft;

  var cx = data.sourceX;
  var cy = data.sourceY;
  for( var i=0,e=movePath.length; i<e; i++ ){

    switch( movePath[i] ){
      case model.MOVE_CODE_UP: cy--; break;
      case model.MOVE_CODE_DOWN: cy++; break;
      case model.MOVE_CODE_LEFT: cx--; break;
      case model.MOVE_CODE_RIGHT: cx++; break;
      default : util.raiseError();
    }

    fuelUsed += data.getSelectionValueAt(cx,cy);
  }

  // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
  if( fuelUsed > points ){
    model.setPathByRecalculation( data, tx,ty );
  }
};

/**
 * Regenerates a path from the source position of an action data memory object
 * to a given target position.
 * 
 * @param data action data memory
 * @param tx target x coordinate
 * @param ty target y coordinate
 */
model.setPathByRecalculation = function( data, tx,ty ){
  var stx = data.sourceX;
  var sty = data.sourceY;
  var movePath = data.movePath;

  if ( DEBUG ){
    util.log( "searching path from (", stx, ",", sty, ") to (", tx, ",", ty, ")" );
  }

  var graph = new Graph( data.selectionData );

  var dsx = stx - data.selectionCX;
  var dsy = sty - data.selectionCY;
  var start = graph.nodes[ dsx ][ dsy ];

  var dtx = tx - data.selectionCX;
  var dty = ty - data.selectionCY;
  var end = graph.nodes[ dtx ][ dty ];

  var path = astar.search(graph.nodes, start, end);

  if ( DEBUG ){
    util.log("calculated way is", path);
  }

  var codesPath = [];
  var cx = stx;
  var cy = sty;
  var cNode;

  for (var i = 0, e = path.length; i < e; i++) {
    cNode = path[i];

    var dir;
    if (cNode.x > cx) dir = model.MOVE_CODE_RIGHT;
    else if (cNode.x < cx) dir = model.MOVE_CODE_LEFT;
    else if (cNode.y > cy) dir = model.MOVE_CODE_DOWN;
    else if (cNode.y < cy) dir = model.MOVE_CODE_UP;
    else {
      util.raiseError();
    }

    codesPath.push(dir);

    cx = cNode.x;
    cy = cNode.y;
  }

  movePath.splice(0);
  for( var i=0,e=codesPath.length; i<e; i++ ){
    movePath[i] = codesPath[i];
  }
};
