controller.stateMachine.data.movePath = {
  
  ILLEGAL_MOVE_FIELD: -1,
  
  data:[],
  
  /**
   * Cleans the move path from move codes.
   */
  clean: function() {
    this.data.splice(0);
  },
  
  /**
     * Clones the path and returns the created array.
     */
  clone: function() {
    var path = [];
    for (var i = 0, e = this.data.length; i < e; i++) {
      path[i] = this.data[i];
    }
    return path;
  },
          
                  
  /**
   * Appends a tile to the move path of a given action data memory object.
   *
   * @param tx target x coordinate
   * @param ty target y coordinate
   * @param code move code to the next tile
   */
  addCodeToPath: function( tx, ty, code ){
    var movePath = controller.stateMachine.data.movePath.data;
    
    // GO BACK
    var lastCode = movePath[movePath.length-1];
    switch( code ){
        
      case model.MOVE_CODE_UP: 
        if( lastCode === model.MOVE_CODE_DOWN ){
          movePath.pop();
          return;
        }
        break;
        
      case model.MOVE_CODE_DOWN: 
        if( lastCode === model.MOVE_CODE_UP ){
          movePath.pop();
          return;
        }
        break;
        
      case model.MOVE_CODE_LEFT:
        if( lastCode === model.MOVE_CODE_RIGHT ){
          movePath.pop();
          return;
        }
        break;
      
      case model.MOVE_CODE_RIGHT:
        if( lastCode === model.MOVE_CODE_LEFT ){
          movePath.pop();
          return;
        }
        break;
      
      default : util.raiseError();
    }
    
    var source = controller.stateMachine.data.source;
    var unit = source.unit;
    var fuelLeft = unit.fuel;
    var fuelUsed = 0; 
    movePath.push( code );
    var points =  unit.type.range;

    if( fuelLeft < points ) points = fuelLeft;

    var cx = source.x;
    var cy = source.y;
    for( var i=0,e=movePath.length; i<e; i++ ){

      switch( movePath[i] ){
        case model.MOVE_CODE_UP: cy--; break;
        case model.MOVE_CODE_DOWN: cy++; break;
        case model.MOVE_CODE_LEFT: cx--; break;
        case model.MOVE_CODE_RIGHT: cx++; break;
        default : util.raiseError();
      }

      // FUEL CONSUMPTION
      fuelUsed += controller.stateMachine.data.selection.getValueAt(cx,cy);
    }

    // GENERATE NEW PATH IF THE OLD IS NOT POSSIBLE
    if( fuelUsed > points ){
      this.setPathByRecalculation( tx,ty );
    }
  },
          
  /**
   * Regenerates a path from the source position of an action data memory object
   * to a given target position.
   * 
   * @param tx target x coordinate
   * @param ty target y coordinate
   */
  setPathByRecalculation: function( tx,ty ){
    var source = controller.stateMachine.data.source;
    var selection = controller.stateMachine.data.selection;
    var movePath = controller.stateMachine.data.movePath.data;
    var stx = source.x;
    var sty = source.y;

    if ( DEBUG ){
      util.log( "searching path from (", stx, ",", sty, ") to (", tx, ",", ty, ")" );
    }

    var graph = new Graph( selection.data );

    var dsx = stx - selection.centerX;
    var dsy = sty - selection.centerY;
    var start = graph.nodes[ dsx ][ dsy ];

    var dtx = tx - selection.centerX;
    var dty = ty - selection.centerY;
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
      else util.raiseError();
     
      codesPath.push(dir);

      cx = cNode.x;
      cy = cNode.y;
    }

    movePath.splice(0);
    for( var i=0,e=codesPath.length; i<e; i++ ){
      movePath[i] = codesPath[i];
    }
  },
          
  /**
   * Injects movable tiles into a action data memory object.
   * 
   * @param data action data memory
   */
  fillMoveMap: function( x,y,unit ){
    var source = controller.stateMachine.data.source;
    var selection = controller.stateMachine.data.selection;    
    if( !unit ) unit = source.unit;
    var mType  = model.moveTypes[ unit.type.movetype ];
    var player = model.players[unit.owner];
    
    if( typeof x !== "number" ) x = source.x;
    if( typeof y !== "number" ) y = source.y;
    
    controller.prepareTags( x, y, model.extractUnitId(unit) );
    var range  = controller.scriptedValue(unit.owner,"moverange", unit.type.range );
    
    // DECREASE RANGE IF NOT ENOUGH FUEL IS AVAILABLE
    if( unit.fuel < range ) range = unit.fuel;

    // ADD START TILE TO MAP
    selection.setCenter( x,y, this.ILLEGAL_MOVE_FIELD );
    selection.setValueAt( x,y,range );

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
        if( cost !== -1 ){

          var cunit = model.unitPosMap[tx][ty];
          if( cunit !== null &&
              model.fogData[tx][ty] > 0 &&
              !cunit.hidden &&
              model.players[cunit.owner].team !== player.team ){
            continue;
          }

          var rest = cp-cost;
          if( rest >= 0 &&
            rest > selection.getValueAt(tx,ty) ){

            // ADD TO MOVE MAP
            selection.setValueAt( tx,ty,rest );

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
        if( selection.getValueAt(x,y) !== this.ILLEGAL_MOVE_FIELD ){
          
          var cost = model.moveCosts( mType, model.map[x][y] );
          selection.setValueAt( x, y, cost );
        }
      }
    }
  }
};