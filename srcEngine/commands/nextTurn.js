controller.userAction({
  
  name: "nextTurn",
  
  key: "NXTR",
  
  condition: function( mem ){
    if( mem.sourceUnit === null ) return true;
    if( mem.sourceUnit.owner === model.turnOwner ){
      return !model.canAct( mem.sourceUnitId );
    }
    else return true;
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
    var wtp;
    
    // FIND NEXT PLAYER
    pid++;
    var turns = 1;
    while( pid !== oid ){
      
      if( pid === CWT_MAX_PLAYER ){
        
        pid = 0;
        model.day++;
        
        model.weatherDays--;
        if( model.weatherDays <= 0 ){
          var days;
          
          var old = model.weather.ID;
          if( old !== "SUN" ){
            days = 4 + parseInt( Math.random()*6, 10 );
            wtp = "SUN";
          }
          else{
            days = 1;
            
            var weatherKeys = Object.keys(model.sheets.weatherSheets);
            var oldIndex = weatherKeys.indexOf( old );
            
            if( oldIndex === -1 ) util.raiseError();
            
            weatherKeys.splice( oldIndex, 1 );
            
            var index = parseInt( Math.random()*weatherKeys.length, 10 );
            wtp = weatherKeys[index];
          }
          
          controller.pushSharedAction( wtp, days, "CWTH" );
        }
        
        var dayLimit = model.rules.dayLimit;
        if( dayLimit !== 0 && model.day === dayLimit ){
          controller.pushSharedAction("EDGM");
        }
      }
      
      if( model.players[pid].team !== CWT_INACTIVE_ID ){
        
        // FOUND NEXT PLAYER
        break;
      }
      
      // INCREASE ID
      pid++;
      turns++;
    }
    if( pid === oid ){
      util.raiseError();
    }
    
    model.turnOwner = pid;
  
    var turnOwnerObj = model.players[pid];  
    var cityRepair = model.rules.cityRepair;
    var fundsValue = model.rules.funds;
    var autoSupply = model.rules.autoSupplyAtTurnStart;
    var autoSupplyAllied = model.rules.resupplyUnitOnAlliedProperties;
    var healUnits = model.rules.healUnitsOnProperties;
    var healUnitsAllied = model.rules.healUnitsOnAlliedProperties;
  
    var startIndex= pid* CWT_MAX_UNITS_PER_PLAYER;
    for( var i= startIndex, e= i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
      var unit = model.units[i];
      
      model.leftActors[i-startIndex] = (unit !== null);
      
      if( unit !== null && unit.x !== -1  && unit.owner !== CWT_INACTIVE_ID ){
        
        // RESUPPLY APCR
        if( autoSupply && model.sheets.unitSheets[unit.type].hasOwnProperty("supply") ){
          controller.pushAction( i, unit.x, unit.y, "TSSP" );
        }
        
        // RESUPPLY CITY
        var property = model.propertyPosMap[ unit.x ][ unit.y ]
        if( property !== null && property.owner !== CWT_INACTIVE_ID ){
          
          var alliedProp = (model.players[property.owner].team === turnOwnerObj.team);
          
          if( property.owner === pid || ( autoSupplyAllied && alliedProp ) ){
            controller.pushAction( i, "RFRS" );
          }
          
          if( healUnits && unit.hp < 99 ){
            if( property.owner === pid || ( healUnitsAllied && alliedProp ) ){
              controller.pushAction( i, 20, "HEUN" );
            }
          }
        }
      }
    }
    
    for( var i=0,e=CWT_MAX_PROPERTIES; i<e; i++ ){
      
      if( model.properties[i].type === "SILO_EMPTY" ){
        controller.actions.siloRegeneration(i,turns);
      }
      
      // FUNDS
      if( model.properties[i].owner === pid ){
        turnOwnerObj.gold += fundsValue;
      }
    }
    
    controller.actions.calculateFog( pid, wtp );
    
    controller.resetTurnTimer();
  }
  
});