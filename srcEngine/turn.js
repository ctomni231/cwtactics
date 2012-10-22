/**
 * Represents the current action day in the game. The day attribute increases
 * everytime if the first player starts its turn.
 */
domain.day = 0;

/**
 * Holds the identical number of the current turn owner.
 */
domain.turnOwner = -1;

/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link data.markAsUnusable}.
 */
domain.leftActors = util.list( CWT_MAX_UNITS_PER_PLAYER, false );

/**
 * Returns the current active day.
 */
game.day = function(){
  return domain.day;
};

/**
 * Returns true if the selected uid can act in the current active turn,
 * else false.
 *
 * @param uid selected unit identical number
 */
game.canAct = function( uid ){
  var startIndex = domain.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  // NOT THE OWNER OF THE CURRENT TURN
  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){

    return false;
  }

  var index = uid - startIndex;
  return domain.leftActors[ index ] === true;
};

/**
 * Returns the team id that won a round by annithilating all enemies or
 * -1 if more than one team is alive.
 */
game.annithilationWinner = function(){
  var team;
  for( var i=0; i<CWT_MAX_PLAYER; i++ ){

    var plC = domain.players[i];
    if( plC === null ) continue;
    var teamC = plC.team;
    if( team === undefined ) team = teamC;
    else if( team !== teamC ){

      // TWO OPPOSITE TEAMS EXISTS -> NO WINNER
      return CWT_INACTIVE_ID;
    }

    // ONLY ONE TEAM FOUND -> THIS IS THE WINNER TEAM
    return team;
  }
};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param pid player id
 */
game.isTurnOwner = function( pid ){
  return domain.turnOwner === pid;
};

/**
 * Returns the current active turn owner.
 */
game.getTurnOwner = function(){ return domain.turnOwner; };

/**
 * Sets the next available player as turn owner. The search algorithm starts
 * with the id of the current turn owner +1. If the player which owns this id
 * is not alive, another +1 will be added to the searched id. If the last id
 * of the player list is also not alive the search will start with 0 again.
 * The day counter increases if this situation happens.
 */
game.setNextPlayerAsTurnOwner = function(){

  var pid = domain.turnOwner;
  var oid = pid;

  pid++;

  // FIND NEXT PLAYER
  while( pid !== oid ){

    if( game.player( pid ) !== null ){

      // FOUND NEXT PLAYER
      break;
    }

    // INCREASE ID
    pid++;
    if( pid === CWT_MAX_PLAYER ) pid = 0;
  }

  // CHECK NEW
  if( pid === oid ) util.logError("cannot find next player");
  domain.turnOwner = pid;

  var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
  for( var i= startIndex,
           e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

    domain.leftActors[i-startIndex] = (
      game.unitById(i) !== null )? true : false;
  }
};

/**
 * Removes an unit from the actable array. An unit that goes into
 * the wait status cannot do another action in the active turn.
 *
 * @param uid
 */
game.markAsUnusable = function( uid ){

  var uid = ( typeof uid === 'number' )? uid : game.extractUnitId( uid );
  var startIndex = domain.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  // NOT THE OWNER OF THE CURRENT TURN
  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER ||
    uid < startIndex ){

    util.logError("unit owner is not the active player");
  }

  domain.leftActors[ uid - startIndex ] = false;

  if( util.DEBUG ){
    util.logInfo("unit",uid,"going into wait status");
  }
};

signal.EVENT_INTO_WAIT = "turn:sendIntoWait";
signal.connect( signal.EVENT_INTO_WAIT, function( ch, uid ){
  actions.wait.action( -1,-1, uid );
});

/**
 * Sends an unit into the wait status
 */
actions.wait = {
  key: "wait",

  condition: function(x,y,rStP,rStU,selected,property,unit){

    if( selected === null || !game.isUnit(selected) ) return false;
    return ( rStU === game.RELATIONSHIP_NONE ||
             rStU === game.RELATIONSHIP_SAME_OBJECT );
  },

  action: function( x, y, suid ){
    game.markAsUnusable( suid );
  }
};

/**
 * Invokes next turn.
 */
actions.nextTurn = {
  key: "nextTurn",

  condition: function(x,y,rStP,rStU,selected,property,unit){
    return ( selected === null || !game.isUnit(selected) &&
      property === null );
  },

  action: function(){
    game.setNextPlayerAsTurnOwner();
  }
}