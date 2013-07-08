// Holds all connected day/turn events.
//
model.dayEvents = util.list( 50, function(){
  return [ null, null ];
});

// Define persistence handler
controller.persistenceHandler(
  
  // load
  function(dom){
    var i,e,list;
    
    // reset data
    list = model.dayEvents;
    for( i=0, e=list.length; i<e; i++ ){
      list[i][0] = null;
      list[i][1] = null;
    }
    
    // load data from dom
    for( i=0, e=dom.dyev.length; i<e; i++ ){
      list[i][0] = dom.dyev[i][0];
      list[i][1] = dom.dyev[i][1];
    }
  },
  
  // save
  function(dom){
    dom.dyev = [];
    
    // save data to dom
    var list = model.dayEvents;
    for( var i=0, e=list.length; i<e; i++ ){
      
      // entry exists when timer is given 
      if( list[i][0] !== null ){
        dom.dyev.push( list );
      }
    }
  }
);

// Adds a timed event to the engine. The action will be invoked
// in `turn` turns.
//
// @param {Number} turn time in turns when the action will be fired
// @param {String} action data
//
model.pushTimedEvent = function( turn, action, args ){
  var list = model.dayEvents;
  
  for( var i=0,e=list.length; i<e; i++ ){
    if( list[i] === null ){
      
      // activate slot
      list[i][0] = turn;
      list[i][1] = action;
      return;
    }
  }
  
  // no free slot found
  model.criticalError( constants.error.ILLEGAL_DATA, constants.error.NO_EVENT_SLOT_IS_FREE );
};

// Ticks a turn.
//
model.tickTimedEvents = function(){
  var list = model.dayEvents;
  for( var i=0,e=list.length; i<e; i++ ){
    
    // if timer entry is null then no event is defined
    if( list[i][0] === null ) continue;
    
    // decrease timer
    list[i][0]--;
    
    // activate event when 
    // timer reaches zero
    if( list[i] === 0 ){
      var args = list[i][1];
      
      // deactivate slot
      list[i][0] = null;
      list[i][1] = null;
      
      // share a command with other clients
      // when this session is a network game
      if( controller.isNetworkGame() ){
        controller.sharedInvokement( args );
      }
      // call command local only
      else controller.localInvokement( args );
    }
  }
};
