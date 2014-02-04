/**
 * Contains the states of the game flow.
 */
cwt.screenFlow = {};

/**
 */
cwt.screenStateMachine = cwt.stateMachine(cwt.screenFlow);

/**
 * Base class for a flow state.
 * 
 * @class
 */
cwt.screeFlowState = my.Class({
  constructor: function( impl ){
    
    // d-pad actions (4)
    this.UP = (impl.UP)? impl.UP : emptyFn;
    this.DOWN = (impl.DOWN)? impl.DOWN : emptyFn;
    this.LEFT = (impl.LEFT)? impl.LEFT : emptyFn;
    this.RIGHT = (impl.RIGHT)? impl.RIGHT : emptyFn;
    
    // actions (4)
    this.CANCEL = (impl.CANCEL)? impl.CANCEL : emptyFn;
    this.ACTION = (impl.ACTION)? impl.ACTION : emptyFn;
    
    // enter state
    this.enterState = (impl.enterState)? impl.enterState : emptyFn;
    
    // call initializer function
    if(impl.init) impl.init.call(this);
  }
});