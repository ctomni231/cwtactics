
/** @private */
cwt._turnPid = -1;

/** @private */
cwt._turnActors = null;

cwt.day = 0;

cwt.onInit( "turn",
function(){

  cwt._turnActors = cwt.util.list( cwt.MAX_UNITS_PER_PLAYER, -1 );

  cwt.serializedProperty("_turnPid");
  cwt.serializedProperty("_turnActors");

  cwt.userAction("nextTurn", function( actions, x, y, prop, unit, selected ){
    if( selected === null ){
      actions.push({
        k:"nextTurn",
        a:null
      });
    }
  });

  cwt.transaction("nextTurn");

  cwt.userAction("wait", function( actions, x, y, prop, unit, selected ){
    if( selected !== null ){
      actions.push({
        k:"wait",
        a:[ selected ]
      });
    }
  });

  cwt.transaction("wait");
});

cwt.canAct = function( uid ){
  var startIndex = cwt._turnPid*cwt.MAX_UNITS_PER_PLAYER;

  // not the owner of the current turn
  if( uid < startIndex || uid >= startIndex + cwt.MAX_UNITS_PER_PLAYER ){
    return false;
  }

  var index = uid - startIndex;
  return cwt._turnActors[ index ] === true;
};

/**
 * Removes an unit from the actable array. An unit that goes into
 * the wait status cannot do another action in the active turn.
 *
 * @param uid
 */
cwt.wait = function( unit ){
  var uid = ( typeof unit === 'number' )? unit : cwt.extractUnitId( unit );
  var startIndex = cwt._turnPid*cwt.MAX_UNITS_PER_PLAYER;

  // not the owner of the current turn
  if( uid < startIndex || uid >= startIndex + cwt.MAX_UNITS_PER_PLAYER ){
    cwt.error("unit owner is not the active player");
  }

  cwt._turnActors[ uid - startIndex ] = false;
  if( cwt.DEBUG ) cwt.info("unit {0} going into wait status", uid );
};

/**
 * @example
 *  type: userAction
 *  type: transaction
 */
cwt.nextTurn = function(){
  if( cwt.DEBUG ) cwt.info("ending turn");

  var pid = cwt._turnPid;

  // end turn
  if( pid !== -1 ) cwt._turnEnd( cwt.player(pid) );

  // find next player
  var oid = pid;
  pid++;
  while( pid !== oid ){

    if( cwt.player( pid ) !== null ){

      // found next player
      break;
    }

    // increase id
    pid++;
    if( pid === cwt.MAX_PLAYER ) pid = 0;
  }

  // check new
  if( pid === oid ) cwt.error("cannot find next player");
  cwt._turnPid = pid;

  // add actors
  for( var i= pid*cwt.MAX_UNITS_PER_PLAYER,
           e=   i+cwt.MAX_UNITS_PER_PLAYER; i<e; i++ ){

    cwt._turnActors[i] = ( cwt.unitById(i) !== null )? true : false;
  }

  // start turn
  cwt._turnStart( cwt.player(pid) );
};

/** @private */
cwt._turnStart = function( player ){
  if( cwt.DEBUG ) cwt.info( player.name+" starts his turn" );
};

/** @private */
cwt._turnEnd = function( player ){
  if( cwt.DEBUG ) cwt.info( player.name+" ends his turn" );
};