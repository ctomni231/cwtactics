cwt.defineLayer( CWT_LAYER_MODEL, function( model, util ){

  /**
   * Represents the current action day in the game. The day attribute increases
   * everytime if the first player starts its turn.
   */
  model.day = 0;

  /**
   * Holds the identical number of the current turn owner.
   */
  model.turnOwner = -1;

  /**
   * Holds the identical numbers of all objects that can act during the turn.
   * After a unit has acted, it should be removed from this list with
   * {@link data.markAsUnusable}.
   */
  model.leftActors = util.list( CWT_MAX_UNITS_PER_PLAYER, false );
});


// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_DATA_ACCESS, function( data, model, util ){

  /**
   * Returns the current active day.
   */
  data.day = function(){
    return model.day;
  };


  /**
   * Returns true if the selected uid can act in the current active turn,
   * else false.
   *
   * @param uid selected unit identical number
   */
  data.canAct = function( uid ){
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){

      return false;
    }

    var index = uid - startIndex;
    return model.leftActors[ index ] === true;
  };

  /**
   * Returns the team id that won a round by annithilating all enemies or
   * -1 if more than one team is alive.
   */
  data.annithilationWinner = function(){
    var team;
    for( var i=0; i<CWT_MAX_PLAYER; i++ ){

      var plC = model.player[i];
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
  data.isTurnOwner = function( pid ){
    return model.turnOwner === pid;
  };

  /**
   * Returns the current active turn owner.
   */
  data.getTurnOwner = function(){ return model.turnOwner; };

  /**
   * Sets the next available player as turn owner. The search algorithm starts
   * with the id of the current turn owner +1. If the player which owns this id
   * is not alive, another +1 will be added to the searched id. If the last id
   * of the player list is also not alive the search will start with 0 again.
   * The day counter increases if this situation happens.
   */
  data.setNextPlayerAsTurnOwner = function(){

    var pid = model.turnOwner;
    var oid = pid;

    pid++;

    // FIND NEXT PLAYER
    while( pid !== oid ){

      if( data.player( pid ) !== null ){

        // FOUND NEXT PLAYER
        break;
      }

      // INCREASE ID
      pid++;
      if( pid === CWT_MAX_PLAYER ) pid = 0;
    }

    // CHECK NEW
    if( pid === oid ) util.logError("cannot find next player");
    model.turnOwner = pid;

    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex,
             e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = (
        data.unitById(i) !== null )? true : false;
    }
  };

  /**
   * Removes an unit from the actable array. An unit that goes into
   * the wait status cannot do another action in the active turn.
   *
   * @param uid
   */
  data.markAsUnusable = function( uid ){

    var uid = ( typeof uid === 'number' )? uid : data.extractUnitId( uid );
    var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

    // NOT THE OWNER OF THE CURRENT TURN
    if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER ||
        uid < startIndex ){

      util.logError("unit owner is not the active player");
    }

    model.leftActors[ uid - startIndex ] = false;
    if( util.DEBUG ) util.logInfo("unit",uid,"going into wait status");
  };
});

// ###########################################################################
// ###########################################################################

cwt.defineLayer( CWT_LAYER_ACTIONS, function( action, data ){

  /**
   * Sends an unit into the wait status
   */
  action.wait = {
    key: "wait",
    condition: function(x,y,rStP,rStU,selected,property,unit){

      if( selected === null ) return false;
      return ( rStU === data.RELATIONSHIP_NONE &&
                rStP === data.RELATIONSHIP_NONE );
    },
    action: function( x, y, suid, tuid, tprid, tx, ty ){
      data.markAsUnusable( suid );1
    }
  };

  /**
   * Invokes next turn.
   */
  action.nextTurn = {
    key: "nextTurn",
    condition: function(x,y,rStP,rStU,selected,property,unit){
      return ( selected === null && property === null );
    },
    action: function(){
      data.setNextPlayerAsTurnOwner();
    }
  }

});