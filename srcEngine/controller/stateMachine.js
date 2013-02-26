/**
 * The central finite state machine of the game engine.
 *
 * @namespace 
 */
controller.stateMachine = /** @lends controller.stateMachine */ {
  
  /**
   * Represents a breaking transition event. To break a transition it should
   * be used in an event function of a state implementation.
   * 
   * @constant
   * @example 
   *    action: function(){
   *        return this.BREAK_TRANSITION;
   *    }
   */
  BREAK_TRANSITION: "__BREAK_TRS__",
  
  /**
   * Current active state.
   */
  state:     "NONE",
  
  /**
   * State history that contains a queue of the state flow.
   * 
   * @type Array
   */
  history:[],
  
  /**
   * Represents a return to last state event. To return to the last state it 
   * should be used in an event function of a state implementation. 
   * 
   * @constant
   * @example 
   *    cancel: function(){
   *        return this.lastState;
   *    }
   */
  lastState: "__LAST_STATE_TRS__",
  
  /**
   * State machine construction diagram object. Every state and transition will 
   * be defined in this descriptor object.
   * 
   * @namespace
   */
  structure: {},
  
  /**
   * Invokes an event in the current active state.
   * 
   * @param {String} ev event name
   * @param {...Object} arguments for the event
   */
  event: function( ev ){
    if( DEBUG ) util.log("got event",ev);
    
    var stateEvent = this.structure[ this.state ][ ev ];
    if( stateEvent === undefined ){
      util.raiseError("missing event",ev,"in state",this.state);
    }
    
    var nextState = stateEvent.apply( this, arguments );
    if( nextState !== undefined ){
      if( nextState !== this.BREAK_TRANSITION ){
        
        var goBack = nextState === this.lastState;
        if( goBack ){
          if( this.history.length === 1 ) nextState = "IDLE";
          else nextState = this.history.pop();
        }
        
        var nextStateImpl = this.structure[ nextState ];
        if( nextStateImpl === undefined ){
          util.raiseError("state",nextState,"is not defined");
        }
        
        if( nextStateImpl.onenter !== undefined ){
          
          var breaker = nextStateImpl.onenter.apply( this, arguments );
          if( breaker === this.BREAK_TRANSITION ){
            
            // BREAK TRANSITION
            return;
          }
          else if( breaker !== undefined ){
            
            
          }
        }
        
        if( !goBack ){
          this.history.push( this.state );
        }
        
        this.state = nextState;
        if( DEBUG ) util.log("changed state to",nextState);
        
        if( nextStateImpl.actionState !== undefined ){
          this.event.call( this, "actionState" );
        }
        
      }
      else if( ev === "actionState" ){
        util.raiseError("an action state cannot return a break transition"); 
      }
    }
    else {
      util.raiseError("an event must return a transition command"); 
    }
  }
};