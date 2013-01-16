controller.registerCommand({

  key: "nextTurn",

  // -----------------------------------------------------------------------
  condition: function( data ){
    if( data.getSourceUnitId() === CWT_INACTIVE_ID ){
      // NO UNIT

      if( data.getSourcePropertyId() !== CWT_INACTIVE_ID &&
          data.getSourceProperty().owner === model.turnOwner ){

        // PROPERTY
        return false;
      }
      else return true;
    }
    else{
      // UNIT

      if( data.getSourceUnit().owner === model.turnOwner &&
          model.canAct( data.getSourceUnitId() ) ){

        // ACTABLE OWN
        return false;
      }
      else return true;
    }

    // FALLBACK
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var pid = model.turnOwner;
    var oid = pid;

    // FIND NEXT PLAYER
    pid++;
    while( pid !== oid ){
      if( pid === CWT_MAX_PLAYER ){
        pid = 0;
        model.day++;
      }

      if( model.players[pid].team !== CWT_INACTIVE_ID ){

        // FOUND NEXT PLAYER
        break;
      }

      // INCREASE ID
      pid++;
    }
    if( DEBUG && pid === oid ){ util.unexpectedSituationError(); }

    model.turnOwner = pid;

    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex,
             e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = (model.units[i] !== null);
    }

    model.generateFogMap( pid );
  }

});