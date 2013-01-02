controller.registerCommand({

  key: "nextTurn",

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnitId = data.getSourceUnitId();

    return (
      (
        data.getSourceUnitId() === -1 ||
        !model.canAct( selectedUnitId ) ||
        data.getSourceUnit().owner !== model.turnOwner
      )
        &&
      (
        data.getSourcePropertyId() === -1 ||
        data.getSourceProperty().owner !== model.turnOwner
      )
    );
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
  }

});