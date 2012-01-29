/* **************** */
/*  Object Service  */
/* **************** */

function objects$isOwnerOf( player, unit ){
    return collection$contains( player.units, unit );
}

function objects$canUse( player, object ){
    // to use an object, a player must be the active one and the unit must be actable
    return player === game$round.activePlayer && collection$contains(game$round.canAct,object);
}




/* ************** */
/*  Move Service  */
/* ************** */

var move$way = [];
var move$mover = null;
var move$startTile = null;
var move$leftMovePoints = 0;
var move$movedata = {};

/**
 * Prepares the internal move way data for a new move command by a user.
 */
function move$moveMap( unit ){
    if( DEBUG ) log$info('prepare move data for '+unit);
    
    var start = move$startTile = objects$findPropertyKey(game$map$units, unit);
    /*
    move$mover = unit;
    
    // clear way
    collection$fillWithElement( move$way , null);
    */
   
    // generate move map
    var mvSheet = db$sheet( db$sheet( unit.type ).movetype );
    
    var curFuel;
    var movedata = {
        start:Math.max( db$sheet( unit.type ).moverange, unit.fuel)
    };
    
    var tmpStack = [ start ];
    var tmpStack2 = [ null,null,null,null ];
    var tmpTile = null;
    
    while( tmpStack.length > 0 ){
        
        tmpTile = tmpStack.pop();
        
        // fill neighbour tiles
        /* x-1 */ tmpStack2[0] = (tmpTile%game$map$width > 0)? tmpTile-1 : null;
        /* x+1 */ tmpStack2[1] = (tmpTile%game$map$width < game$map$width-1 )? tmpTile+1 : null;
        /* y-1 */ tmpStack2[2] = (tmpTile/game$map$width > 0)? tmpTile-game$map$width : null;
        /* y+1 */ tmpStack2[3] = (tmpTile/game$map$width < game$map$height-1 )? tmpTile+game$map$width : null;
        
        // check every neighbour 
        for( var i=0;i<4;i++ ){
            
            if( tmpStack2[i] != null ){
                
                // neighbour exists, check it
                curFuel = movedata[ tmpTile ] - mvSheet.costs[ game$map[ tmpStack2[i] ] ];
                
                // if curFuel greater equals zero, the tile is moveable from tmpTile
                if( curFuel >= 0 ){
                    
                    // set only if the tile is not in the movedata or the current left points are smaller than the
                    // left points from move from tmpTile to the tile 
                    if( typeof movedata[ tmpStack2[i] ] === 'undefined' || movedata[ tmpStack2[i] ] < curFuel ){
                        tmpStack.push( tmpStack2[i] );
                    }
                }
            }
        }
        
    }
    
    //convert left points in movedata to general tile move costs (for client) and leave moverange in central tile
    for( var key in movedata ){
        if( key !== start && movedata.hasOwnProperty(key) ){
            movedata[key] = mvSheet.costs[ db$sheet( game$map[movedata[key]] ).id ];
        }
    }
    
    return true;
}

function move$calculateWay( start, end ){
    
}

function move$canMoveToInOneTurn( unit, start, end ){
    
    // distance is greater than the movepoints, not possible to reach in one turn
    if( game$distance(start, end) > db$sheet( unit.type ).movepoints ) return false;
    
    // simulate move
    move$prepareMoveway(unit);
    move$calculateWay(start,end);
    
    // if size of moveway is greater zero, then a valid way is found
    return move$way.length > 0;
}

function move$moveUnit( moveway ){
    
    if( DEBUG ) log$info("moving "+move$mover);
    if( DEBUG ){
        expect( move$mover ).not.isNull();
        expect( moveway ).isArray().size.greaterThen(1);
    }
    
    //@TODO break moveway if enemy unit is in way [@WAITS fog system]
    //@TODO refactor algorithm
    var lastTile = null;
    for( var i=0, e=move$way.length-1; i<e; i++ ){
        
        //@TODO recalculate fuel if way will breaked 
        
        if( move$way[i] != null ) lastTile = move$way[i];
    }
    
    if( DEBUG ) log$info("from ("+game$indexToPosX(move$startTile)+","+game$indexToPosY(move$startTile)+") to ("+
                                  game$indexToPosX(lastTile)+","+game$indexToPosY(lastTile)+")");
    
    // decrease fuel by usage
    var fuelUsed = db$sheet( move$mover.type ).maxFuel - move$leftMovePoints;
    unit.fuel -= fuelUsed;
    
    // change unit position
    delete game$map$units[move$startTile];
    game$map$units[lastTile] = move$mover;
    
    // clear mover
    move$mover = null;
    
    if( DEBUG ) log$info("done");
}




/* ************** */
/*  Turn Service  */
/* ************** */

var turn$events$turnEnd = "turnEnds";
var turn$events$turnStart = "turnStarts";

/**
 * Next turn function.
 * 
 * [@WAITS BETA-1]
 */
function turn$next(){
    if( DEBUG ) log$info("starting next turn");
    
    // event turn ends
    if( DEBUG ) log$info("firing turn end event");
    event$dispatch(turn$events$turnEnd);
    
    game$round.turn++;
    if( DEBUG ) log$info("turn number is "+game$round.turn);
    
    if( DEBUG ) log$info("tick next player (current is "+game$round.activePlayer+")");
    //TODO check circular dependency
    while( true ){
        
        game$round$activePlayerID++;
        
        // increase day if you reach the invalid player id, go back to zero ( one day cylce is done )
        if( game$round$activePlayerID === game$round$players.length ){
            
            game$round$activePlayerID = 0;

            game$round$day++;
            event$dispatch("nextDay",game$round$day);
            
            if( DEBUG ) log$info("day changed, day number is now "+game$round.turn);
        }
        
        // valid player found
        if( game$round.players[game$round.activePlayer].team !== game$round$playerLoosed ) break;
    }
    
    //game$round$playerLoosed
    //TODO: increase day counter
    
    // set actable units
    collection$copy( game$round.canAct, nextPlayer.units );
    
    // pay salary
    if( DEBUG ) log$info("paying salary for units");
    collection$each( nextPlayer.units, function( unit ){
        nextPlayer.gold -= unit.sheet().salary; // correct?
        //TODO: remove unit if salary isn't payable
    });
    
    // give funds
    if( DEBUG ) log$info("receiving funds from properties");
    collection$each( map.properties, function( property ){
        if( property.owner === nextPlayer ){
            nextPlayer.gold += property.sheet().funds;
        }
    });
    
    // event turn starts
    if( DEBUG ) log$info("firing turn starts event");
    event$dispatch(turn$events$turnStarts);
    
    if( DEBUG ) log$info("turn startet");
}