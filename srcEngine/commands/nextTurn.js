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

        var dayLimit = model.rules.dayLimit;
        if( dayLimit !== 0 && model.day === dayLimit ){
          var nData = controller.aquireActionDataObject();
          nData.setAction( "endGame" );
          controller.pushActionDataIntoBuffer( nData, true );
        }
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

    var dataObj = new controller.ActionData();
    var autoSupply = model.rules.autoSupplyAtTurnStart;
    dataObj.setAction("supplyTurnStart");
    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex,
             e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = (model.units[i] !== null);

      // TODO make better
      var unit = model.units[i];
      if( autoSupply && unit.type === "APCR" ){

        dataObj.setSource( unit.x, unit.y );
        dataObj.setTarget( unit.x, unit.y );
        dataObj.setSourceUnit( unit );
        controller.invokeCommand( dataObj );
      }
    }

    // TODO make better
    var turnOwnerObj = model.players[pid];
    var cityRepair = model.rules.cityRepair;
    var fundsValue = model.rules.funds;
    for( var i=0, e=model.properties.length; i<e; i++ ){
      if( model.properties[i].owner === pid ){
        turnOwnerObj.gold += fundsValue;

      }
    }

    model.generateFogMap( pid );
  }

});