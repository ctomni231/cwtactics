(function(){
  
  var BACK_TO_LAST_STATE = "$_LAST_STATE";
  var BREAK_TRANSITION = "$_BREAK_TRANSITION";
  var START_STATE = "initial";
  
  function backToLastState(){
    return BACK_TO_LAST_STATE;
  }
  
  function breakTransition(){
    return BREAK_TRANSITION;
  }
  
  function reset(){
    
    // reset state
    machine.state = START_STATE;
    
    // clean memory
    var keys = Object.keys( this.memory );
    for( var i=0,e=keys.length; i<e; i++ ) delete this.memory[keys[i]];
  }
  
  function event( ev ){
    var stateEvent = this.structure[ this.state ][ ev ];
    
    // event must be defined in the current state
    if( stateEvent === undefined ){
        this.onerror( ev, this.state, "N/A", constants.error.STM_NO_EVENT );
    } 
    
    // grab next state from the event function of the current state
    var nextState = stateEvent.apply( this, arguments ); 
    if( !nextState ){
        this.onerror( ev, this.state, nextState, 
            constants.error.STM_INVALID_NEXT_STATE 
        );
    }
    
    // cannot break an action state transition
    if( nextState === BREAK_TRANSITION && ev === "actionState" ){
        this.onerror( ev, this.state, nextState, 
            constants.error.STM_ACTIONSTATE_BREAKS_TRANS 
        );
    }
    
    var goBack = nextState === this.lastState;
    if( goBack ){
      if( this.history.length === 1 ) nextState = "IDLE";
      else nextState = this.history.pop();
    }
    
    // check next state and call `onenter` event
    var nextStateImpl = this.structure[ nextState ];
    if( !nextStateImpl ) this.onerror( ev, this.state, nextState, constants.error.STM_NEXT_STATE_MISSING );
    if( nextStateImpl.onenter ){
      var breaker = nextStateImpl.onenter.apply( this, arguments );
      if( breaker === BREAK_TRANSITION ) return;
    }
    
    // push state into history and select it
    if( !goBack ) this.history.push( this.state );
    this.state = nextState;
    
    // if next state is an action state then
    // invoke it directly
    if( nextStateImpl.actionState !== undefined ) this.event.call( this, "actionState" );
  }
  
  // Invokes an event in the current active state.
  //   
  // @param {String} ev event name
  // @param {...Object} arguments for the event
  //     
  function error( event, fromState, toState, errCode ){
    util.log( "state machine error (code:",errCode,"ev:",event,"from:",fromState,"to:",toState,")" );
  }
  
  function create( impl, config ){
    var machine = {};
    
    // set data
    machine.struct = (impl)? impl: {};
    machine.state = START_STATE;
    machine.lastState = null;   
    machine.history = ( !config.noHistory )? []: null;
    
    // set functions
    machine.reset = reset;
    machine.event = event;
    machine.onerror = ( config.onerror )? config.onerror: error;
    machine.backToLastState = backToLastState;
    machine.breakTransition = breakTransition;
    
    return machine;
  }
  
  util.stateMachine = create;
  
})();
