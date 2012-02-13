var cwtMove = {};
require.js("model.game",function(){

  cwtMove.Schema = {};

  cwtMove.Schema.Movemap = {
    type:'object',
    content:{
      mover:{ format:'int' },
      way:{ type:'array' }
    }
  }

  /**
   * Generates a move map for an unit.
   *
   * @param unit
   */
  cwtMove.movemap = function( unit ){
    if( DEBUG ) cwtLog.info('prepare move data for {0}',unit);

    //TODO current system is designed for old single dimension array, refactor for two dimensions

    var mvSheet = cwtSheets.sheet( cwtSheets.sheet( unit.type ).moveType );
    var curFuel;
    var mapW = cwtModel.game.width;
    var mapH = cwtModel.game.height;
    var start = null; // find unit tile
    var movedata = {};

    // register start tile with full movepoints
    movedata[ start ] = Math.max( cwtSheets.sheet( unit.type ).moverange, unit.fuel );

    var tmpStack = [ start ];
    var tmpStack2 = [ null,null,null,null ];
    var tmpTile = null;
    while( tmpStack.length > 0 ){

      tmpTile = tmpStack.pop();

      if( DEBUG ) cwtLog.info("receiving neighbours of {0}",tmpTile);

      // fill neighbour tiles
      /* x-1 */ tmpStack2[0] = (tmpTile%mapW > 0)? tmpTile-1 : null;
      /* x+1 */ tmpStack2[1] = (tmpTile%mapW < mapW-1 )? tmpTile+1 : null;
      /* y-1 */ tmpStack2[2] = (tmpTile/mapW > 0)? tmpTile-mapW : null;
      /* y+1 */ tmpStack2[3] = (tmpTile/mapW < mapH-1 )? tmpTile+mapW : null;

      // check every neighbour
      for( var i=0;i<4;i++ ){

        if( tmpStack2[i] != null ){

          if( DEBUG ) log_info("checking costs of move from "+tmpTile+" to "+tmpStack2[i] );

          // neighbour exists, check it
          curFuel = movedata[ tmpTile ] - mvSheet.costs[ game_map[ tmpStack2[i] ] ];

          // if curFuel greater equals zero, the tile is moveable from tmpTile
          if( curFuel >= 0 ){

            // set only if the tile is not in the movedata or the current left points are smaller than the
            // left points from move from tmpTile to the tile
            if( typeof movedata[ tmpStack2[i] ] === 'undefined' || movedata[ tmpStack2[i] ] < curFuel ){

              if( DEBUG ) log_info("the move over "+tmpTile+" is the best choice to move from "+start+
                " to "+tmpStack2[i] );

              tmpStack.push( tmpStack2[i] );
            }
          }
        }
      }
    };

    cwtMove._movemapCache = null;

    //convert left points in movedata to general tile move costs (for client) and leave moverange in central tile
    for( var key in movedata ){
      if( key !== start && movedata.hasOwnProperty(key) ){
        movedata[key] = mvSheet.costs[ cwtSheets.sheet( game_map[movedata[key]] ).id ];
      }
    }

    return true;
  };

  cwtMove.move = function(moveway){
    if(DEBUG) cwtLog.info("moving {0}",move_mover);

    // CHECK PARAMETER
    amanda.validate(moveway,cwtMove.Schema.Movemap);

    // RECEIVE MOVE MAP
    var movemap;
    if( cwtMove._movemapCache != null && cwtMove._movemapCache.unit === moveway.mover ){
      // USE CACHED VALUE
      movemap = cwtMove._movemapCache;
    }
    else{
      // USE FRESH ONE
    }

    // CHECK WAY

    // MOVE

  };

  cwtMove.heuristics = {
    xyz: function(){}
  };

  cwtMove.calculateWay = function( start, end ){

    //PROBLEM: our map is an array with one dimension, astar expects an array with two dimensions
    //SOL: 1. change astar library
    //     2. change cwt model

    // a-star search
    astar.search( null , start, end, move__AStarHeuristic );
  };

  cwtMove.canMoveInOneTurn = function( unit, start, end ){

    // distance is greater than the movepoints, not possible to reach in one turn
    if( cwtModel.distance(start, end) > cwtSheets.sheet( unit.type ).movepoints ) return false;

    // simulate move
    var map = cwtMove.movemap(unit);
    cwtMove.calculateWay(start,end);

    // if size of moveway is greater zero, then a valid way is found
    return map.length > 0;
  };

});