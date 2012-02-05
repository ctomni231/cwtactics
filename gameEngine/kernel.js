/* **************** */
/*  Object Service  */
/* **************** */

function objects_isOwnerOf( player, unit ){
    return collection_contains( player.units, unit );
}

function objects_canUse( player, object ){
    // to use an object, a player must be the active one and the unit must be actable
    return player === game_round.activePlayer && collection_contains(game_round.canAct,object);
}

/* ************** */
/*  Move Service  */
/* ************** */

// move will be directly init by client with movearray + moveunit
//var move_way = [];
//var move_mover = null;
//var move_startTile = null;
//var move_leftMovePoints = 0;
//var move_movedata = {};

/**
 * Prepares the internal move way data for a new move command by a user.
 */
function move_moveMap( unit ){
    if( DEBUG ) log_info('prepare move data for '+unit);
    
    var start = move_startTile = objects_findPropertyKey(game_map_units, unit);
    /*
    move_mover = unit;
    
    // clear way
    collection_fillWithElement( move_way , null);
    */
   
    // generate move map
    var mvSheet = db_sheet( db_sheet( unit.type ).moveType );
    
    var curFuel;
    var movedata = {
        start:Math.max( db_sheet( unit.type ).moverange, unit.fuel)
    };
    
    var tmpStack = [ start ];
    var tmpStack2 = [ null,null,null,null ];
    var tmpTile = null;
    
    while( tmpStack.length > 0 ){
        
        tmpTile = tmpStack.pop();
        
        if( DEBUG ) log_info("receiving neighbours of "+tmpTile );
        
        // fill neighbour tiles
        /* x-1 */ tmpStack2[0] = (tmpTile%game_map_width > 0)? tmpTile-1 : null;
        /* x+1 */ tmpStack2[1] = (tmpTile%game_map_width < game_map_width-1 )? tmpTile+1 : null;
        /* y-1 */ tmpStack2[2] = (tmpTile/game_map_width > 0)? tmpTile-game_map_width : null;
        /* y+1 */ tmpStack2[3] = (tmpTile/game_map_width < game_map_height-1 )? tmpTile+game_map_width : null;
        
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
        
    }
    
    //convert left points in movedata to general tile move costs (for client) and leave moverange in central tile
    for( var key in movedata ){
        if( key !== start && movedata.hasOwnProperty(key) ){
            movedata[key] = mvSheet.costs[ db_sheet( game_map[movedata[key]] ).id ];
        }
    }
    
    return true;
}

function move_calculateWay( start, end ){
    
    //PROBLEM: our map is an array with one dimension, astar expects an array with two dimensions
    //SOL: 1. change astar library
    //     2. change cwt model
    
    // a-star search
    astar.search( null , start, end, move__AStarHeuristic );
}

function move__AStarHeuristic(){ // maybe alter astar for disabled ways
    // calc movepoints  
    // if kind of wall ( not move able ), return 999999
    // own unit or visible allied/enemy, return 999999
}

function move_canMoveToInOneTurn( unit, start, end ){
    
    // distance is greater than the movepoints, not possible to reach in one turn
    if( game_distance(start, end) > db_sheet( unit.type ).movepoints ) return false;
    
    // simulate move
    move_prepareMoveway(unit);
    move_calculateWay(start,end);
    
    // if size of moveway is greater zero, then a valid way is found
    return move_way.length > 0;
}

function move_moveUnit( unit, moveway ){
    
    if( DEBUG ) log_info("moving "+move_mover);
    if( DEBUG ){
        //expect( move_mover ).not.isNull();
        expect( moveway ).isArray().size.greaterThen(1);
    }
    
    // check moveway 
    if( move_calculateWay( moveway[0], moveway[ moveway.length -1 ]) == 0 ) throw Error("illegal move way");
    
    //@TODO break moveway if enemy unit is in way [@WAITS fog system]
    //@TODO refactor algorithm
    var lastTile = null;
    for( var i=0, e=move_way.length-1; i<e; i++ ){
        
        //@TODO recalculate fuel if way will breaked 
        
        if( move_way[i] != null ) lastTile = move_way[i];
    }
    
    if( DEBUG ) log_info("from ("+game_indexToPosX(move_startTile)+","+game_indexToPosY(move_startTile)+") to ("+
                                  game_indexToPosX(lastTile)+","+game_indexToPosY(lastTile)+")");
    
    // decrease fuel by usage
    var fuelUsed = db_sheet( move_mover.type ).maxFuel - move_leftMovePoints;
    unit.fuel -= fuelUsed;
    
    // change unit position
    delete game_map_units[move_startTile];
    game_map_units[lastTile] = move_mover;
    
    // clear mover
    move_mover = null;
    
    if( DEBUG ) log_info("done");
}




/* ************** */
/*  Turn Service  */
/* ************** */

var turn_events_turnEnd = "turnEnds";
var turn_events_turnStart = "turnStarts";

/**
 * Next turn function.
 * 
 * [@WAITS BETA-1]
 */
function turn_next(){
    if( DEBUG ) log_info("starting next turn");
    
    // event turn ends
    if( DEBUG ) log_info("firing turn end event");
    event_dispatch(turn_events_turnEnd);
    
    game_round.turn++;
    if( DEBUG ) log_info("turn number is "+game_round.turn);
    
    if( DEBUG ) log_info("tick next player (current is "+game_round.activePlayer+")");
    //TODO check circular dependency
    while( true ){
        
        game_round_activePlayerID++;
        
        // increase day if you reach the invalid player id, go back to zero ( one day cylce is done )
        if( game_round_activePlayerID === game_round_players.length ){
            
            game_round_activePlayerID = 0;

            game_round_day++;
            event_dispatch("nextDay",game_round_day);
            
            if( DEBUG ) log_info("day changed, day number is now "+game_round.turn);
        }
        
        // valid player found
        if( game_round.players[game_round.activePlayer].team !== game_round_playerLoosed ) break;
    }
    
    //game_round_playerLoosed
    //TODO: increase day counter
    
    // set actable units
    collection_copy( game_round.canAct, nextPlayer.units );
    
    // pay salary
    if( DEBUG ) log_info("paying salary for units");
    collection_each( nextPlayer.units, function( unit ){
        nextPlayer.gold -= unit.sheet().salary; // correct?
        //TODO: remove unit if salary isn't payable
    });
    
    // give funds
    if( DEBUG ) log_info("receiving funds from properties");
    collection_each( map.properties, function( property ){
        if( property.owner === nextPlayer ){
            nextPlayer.gold += property.sheet().funds;
        }
    });
    
    // event turn starts
    if( DEBUG ) log_info("firing turn starts event");
    event_dispatch(turn_events_turnStarts);
    
    if( DEBUG ) log_info("turn startet");
}