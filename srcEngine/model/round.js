controller.registerInvokableCommand("nextTurn");

controller.defineEvent("nextTurn");

controller.defineGameConfig("dayLimit",0,999,0);

// Represents the current action day in the game. The day attribute increases
// everytime if the first player starts its turn.
// 
// @type {Number}
model.day = 0;

// Holds the identical number of the current turn owner.
// 
// @type {Number}  
model.turnOwner = -1;

// Define persitence handler
controller.persistenceHandler(
  
  // load
  function( dom ){ 
    
    // grab turn owner
    if( typeof dom.trOw !== "undefined" ) model.turnOwner = dom.trOw; 
    else model.turnOwner = 0;
    
    // grab day
    if( typeof dom.day !== "undefined" ) model.day = dom.day;
    else model.day = 0;
  },
  
  // save
  function( dom ){ 
    dom.trOw = model.turnOwner; 
    dom.day  = model.day; 
  }
);

// Returns true if the given player id is the current turn owner.
//
// @param pid player id
model.isTurnOwner = function( pid ){
  return model.turnOwner === pid;
};

// Converts a number of days into turns.
//
// @param {Number} v number in days 
model.daysToTurns = function( v ){
  return model.players.length*v;
};

// Ends the turn for the current active turn owner.
// Invokes the `nextTurn` event.
model.nextTurn = function(){
  var pid = model.turnOwner;
  var oid = pid;
  var i,e;
  
  // Try to find next player from the player pool
  pid++;
  while( pid !== oid ){
    
    if( pid === constants.MAX_PLAYER ){
      pid = 0;
      
      // Next day 
      model.day++;
      model.tickTimedEvents();
      
      var dayLimit = controller.configValue("dayLimit");
      if( dayLimit > 0 && model.day === dayLimit ){
        controller.endGameRound();
      }
    }
    
    // Found next player
    if( model.players[pid].team !== constants.INACTIVE_ID ) break;
    
    pid++;
  }
  
  // If the new player id is the same as the old 
  // player id then the game data is corrupted
  if( pid === oid ){
    model.criticalError( constants.error.ILLEGAL_DATA, constants.error.CANNOT_FIND_NEXT_PLAYER );
  }
  
  // do turn start stuff for all **properties**
  for( i=0,e=model.properties.length; i<e; i++ ){
    if( model.properties[i].owner !== pid ) continue;
    
    model.doPropertyGiveFunds( i );
    model.propertyRepairs( i );
    model.propertySupply( i );
  }
  
  var turnStartSupply = ( controller.configValue("autoSupplyAtTurnStart") === 1 );
  
  // do turn start stuff for all **units**
  i= model.getFirstUnitSlotId( pid ); 
  e= model.getLastUnitSlotId( pid );
  for( ; i<e; i++ ){
    if( model.units[i].owner === constants.INACTIVE_ID ) continue;
    
    model.drainFuel( i );
    if(turnStartSupply) model.tryUnitSuppliesNeighbours( i );
  }
  
  model.resetActableStatus(pid);
  model.recalculateFogMap( pid );
  model.resetTurnTimer(); 
    
  // Sets the new turn owner
  model.turnOwner = pid;
  
	controller.events.nextTurn();
  
  // start AI logic if new turn owner is AI controlled this local instance is the host
  if( controller.isHost() && controller.isPlayerAiControlled(pid) ){
    controller.localInvokement("prepareAiTurn",[]);
  }
};