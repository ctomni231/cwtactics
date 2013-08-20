controller.registerInvokableCommand("decreaseManpower");

controller.defineEvent("decreaseManpower");

// Man power data array that holds the amount
// times that an unit can be builded
model.manpower = util.list( constants.MAX_PLAYER, 999999 );

// Define persitence handler
controller.persistenceHandler(
  
  // load
  function( dom ){ 
    model.manpower.resetValues();
    
    // grab values from dom model
    if( dom.mpw.length > 0 ) model.manpower.grabValues( dom.mpw );
  },
  
  // save
  function( dom ){ 
    // clone values into a new array 
    // and place it into the save dom
    dom.mpw = model.manpower.cloneValues([]);
  }
);

// Returns true if a player has left man power else false.
//
// @param {Number} pid player id
//
model.hasLeftManpower = function( pid ){
  return model.manpower[pid] > 0;
};

// Decreases the amount of man power.
//
// @param {Number} pid player id
//
model.decreaseManpower = function( pid ){
  model.manpower[pid]--;
  
  // Invoke model event
  controller.events.decreaseManpower(pid);
};

