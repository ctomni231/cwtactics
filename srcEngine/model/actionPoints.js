/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link model.markUnitNonActable}.
 */
model.leftActors = util.list( constants.MAX_UNITS_PER_PLAYER, false );

// Define persistence handler
controller.persistenceHandler(
  
  // load
  function( dom ){
    
    // reset data to false (*no one can act*)
    for( var i=0, e=model.leftActors.length; i<e; i++ ) model.leftActors[i] = false;
    
    var arr = dom.actr;
    if( arr ){
      
      // make all slots actable that allowed to act
      // by the map data
      for( i=0, e=arr.length; i<e; i++ ) model.leftActors[ arr[i] ] = true;
    }
  },
  
  // save
  function( dom ){
    var arr = [];
    for( var i=0,e=model.leftActors.length; i<e; i++ ){
      
      // add slot index to the document model if the slot can act
      if( model.leftActors[i] ) arr.push( i );
    }
    
    dom.actr = arr;
  }
);

// Returns true if the selected uid can act in the current active turn,
// else false.
//
// @param uid selected unit id 
model.canAct = function( uid ){
  var startIndex = model.turnOwner * constants.MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + constants.MAX_UNITS_PER_PLAYER || uid < startIndex ){
    return false;
  }
  else return model.leftActors[ uid - startIndex ] === true;
};

// Sets the actable status of a given unit id. Only units of the
// current active turn owner can change their status.
//
// @param {Number} uid selected unit identical number
// @param {Boolean} canAct the target status  
model.setActableStatus = function( uid, canAct ){
  var startIndex = model.turnOwner * constants.MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + constants.MAX_UNITS_PER_PLAYER || uid < startIndex ){
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.TURN_OWNER_ONLY
    );
  }
  else model.leftActors[ uid - startIndex ] = canAct;
};

// Define event
controller.defineEvent("trapWait");

/**
 * Called when an unit is trapped. Invokes the `trapWait` event.
 * 
 * @param {Number} uid
 */
model.trapWait = function( uid ){
  model.setActableStatus( uid, false );
  
  // Invoke event
  var evCb = controller.events.trapWait;
  if( evCb ) evCb( uid );
};

// Define event
controller.defineEvent("markUnitNonActable");

/**
 * @param {Number} uid
 */
model.markUnitNonActable = function( uid ){
  model.setActableStatus( uid, false );
  
  // Invoke event
  var evCb = controller.events.markUnitNonActable;
  if( evCb ) evCb( uid );
};

// Define event
controller.defineEvent("markUnitActable");

/**
 * @param {Number} uid
 */
model.markUnitActable = function( uid ){
  model.setActableStatus( uid, true );
  
  // Invoke event
  var evCb = controller.events.markUnitActable;
  if( evCb ) evCb( uid );
};