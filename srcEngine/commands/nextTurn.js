controller.userAction({

  name: "nextTurn",

  key: "NXTR",

  condition: function( mem ){

    if( mem.sourceUnitId === CWT_INACTIVE_ID ){
      // NO UNIT

      if( mem.sourcePropertyId !== CWT_INACTIVE_ID && mem.sourceProperty.owner === model.turnOwner ){

        // PROPERTY
        return false;
      }
      else return true;
    }
    else{
      // UNIT

      if( mem.sourceUnit.owner === model.turnOwner && model.canAct( mem.sourceUnitId ) ){

        // ACT ABLE OWN
        return false;
      }
      else return true;
    }

    // FALLBACK
    return false;
  },

  createDataSet: function( mem ){
    return [];
  },

  /**
   * Ends the turn for the current active player.
   *
   * @methodOf controller.actions
   * @name nextTurn
   */
  action: function(){
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
          controller.pushSharedAction("endGame");
        }
      }

      if( model.players[pid].team !== CWT_INACTIVE_ID ){

        // FOUND NEXT PLAYER
        break;
      }

      // INCREASE ID
      pid++;
    }
    if( pid === oid ){
      util.raiseError();
    }

    model.turnOwner = pid;

    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex, e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

      model.leftActors[i-startIndex] = (model.units[i] !== null);
    }
    
    for( var i=0,e=CWT_MAX_PROPERTIES; i<e; i++ ){
      if( model.properties[i].type === "SILO_EMPTY" ){
        controller.actions.siloRegeneration(i);
      }
    }
    
    /*
    var dataObj = new controller.ActionData();
    var autoSupply = model.rules.autoSupplyAtTurnStart;
    dataObj.setAction("supplyTurnStart");
    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex, e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){

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
    */

    controller.actions.calculateFog( pid );
    
    controller.resetTurnTimer();
  }

});