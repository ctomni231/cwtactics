(function(){
  
  var BACK_TO_LAST_STATE = "$_LAST_STATE";
  var BREAK_TRANSITION = "$_BREAK_TRANSITION";
  var START_STATE = "NONE";
  
  function backToLastState(){
    return BACK_TO_LAST_STATE;
  }
  
  function breakTransition(){
    return BREAK_TRANSITION;
  }
  
  function clearHistory() {
    if( this.history !== null && this.history ) this.history.splice(0);
  }
  
  function reset(){
    
    // reset state
    this.state = START_STATE;
    this.lastState = null;
    this.clearHistory();
  }
  
  function event( ev ){
    var stateEvent = this.structure[ this.state ][ ev ];
    
    // event must be defined in the current state
    if( stateEvent === undefined ){
      this.onerror( ev, this.state, "N/A", "NO EVENT" );
      return;
    } 
    
    // grab next state from the event function of the current state
    var nextState = stateEvent.apply( this, arguments ); 
    if( !nextState ){
      this.onerror( ev, this.state, nextState, 
                   error.STM_INVALID_NEXT_STATE
                  );
    }
    
    // cannot break an action state transition
    if( nextState === BREAK_TRANSITION && ev === "actionState" ){
      this.onerror( ev, this.state, nextState,"BREAKS TRANSITION" );
      return;
    }
    
    if( nextState === BREAK_TRANSITION ) return; 
    
    var goBack = (nextState === this.backToLastState());
    if( goBack ){
      if( this.history === null ){
        this.onerror( ev, this.state, nextState, "NO HISTORY GIVEN" );
      }
        
      if( this.history.length === 1 ) nextState = "IDLE";
      else {
        this.history.pop();
        nextState = this.history[ this.history.length-1 ];
      }
    }
    
    // check next state and call `onenter` event
    var nextStateImpl = this.structure[ nextState ];
    var oldState = this.state;
    this.state = nextState;
    
    if( !nextStateImpl ){
      this.state = oldState;
      this.onerror( ev, this.state, nextState, "NO NEXT STATE" );
      return;
    }
    if( nextStateImpl.onenter ){
      var breaker = nextStateImpl.onenter.apply( this, arguments );
      if( breaker === BREAK_TRANSITION ){
        this.state = oldState;
        return;
      }
    }
    
    // push state into history and select it
    if( this.history !== null && !goBack ) this.history.push( this.state );
    
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
    util.log( "state machine error (code:",errCode,"ev:",event,"from:",fromState,"to:",toState,")");
  }
  
  function create( impl, config ){
    var machine = {};
    
    // set data
    machine.structure = (impl)? impl: {};
    machine.state = START_STATE;
    machine.lastState = null;   
    machine.history = ( config && !config.noHistory )? null: [];
    
    // set functions
    machine.reset = reset;
    machine.event = event;
    machine.clearHistory = clearHistory;
    machine.backToLastState = backToLastState;
    machine.breakTransition = breakTransition;
    machine.onerror = ( config && config.onerror )? config.onerror: error;
    
    return machine;
  }
  
  util.stateMachine = create;
  
})();
