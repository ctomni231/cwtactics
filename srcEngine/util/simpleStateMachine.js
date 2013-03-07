/**

  This is a small but state machine for JavaScript. It's originally designed
  for Custom Wars Tactics (Link:) but can be used in other turn based games as well. 
  
  Target of this library is to provide a complex configurate able state machine in a very
  small library (03.2013 => 1KB minified and 0.5KB gzipped). 
  
  This is why the complexity of this state machine is low overall. This engine
  may suits for you if you only need to have a flow between states with basic on enter events 
  and a small history.  
  
  ToDo:
    - convert DEBUG statements to a more generic solution
    - better constant for the last state transition
    - may add onLeave event
    - debug reset functionality
    - error event for illegal transitions
  
  License (MIT):
    
    Copyright (c) 2013 BlackCat [blackcat.myako@googlemail.com]

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
    copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the 
    following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  */

if( simpleStateMachine !== undefined ) throw Error("simpleStateMachine is already defined in the global scope");

/**
 * The central finite state machine of the game engine. 
 */
var simpleStateMachine = function(){
  
  return /** @lends simpleStateMachine */ {
    
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
};