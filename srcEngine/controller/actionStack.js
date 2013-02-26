/** 
 * Action buffer object that holds all actions that aren't invoked yet.
 * 
 * @private 
 */
controller.actionBuffer_ = util.createRingBuffer( CWT_ACTIONS_BUFFER_SIZE );

/**
 * Pushes an action into the buffer and invokes a transaction process if the action
 * is marked as shared.
 * 
 * @example 
 *  data format
 *  [ parameters... , actionKey ]
 */
controller.pushSharedAction = function(){
  var cmd = controller.actionObjects_[ arguments[arguments.length-1] ];
  if( cmd.shared && controller.isNetworkGame() ){
    this.sendNetworkMessage_( arguments );
  }
  
  controller.pushAction.apply( this, arguments );
};

/**
 * Pushes an action into the buffer.
 * 
 * @example 
 *  data format
 *  [ parameters... , actionKey ]
 */
controller.pushAction = function(){
  if( DEBUG ){
    util.log("push action",JSON.stringify(arguments),"into action stack");
  }

  controller.actionBuffer_.push( arguments );
};

/**
 * Returns true if no action is in the action 
 * stack, else false.
 */
controller.noNextActions  = function(){
  return controller.actionBuffer_.isEmpty();
};

/**
 * Pops the oldest action from the buffer and evaluates it. After the evaluation this 
 * function returns the action. If no action is in the buffer, null will be returned.
 */
controller.doNextAction = function (){
  if( controller.actionBuffer_.isEmpty() ){
    return null;
  }

  var data = controller.actionBuffer_.pop();
  if( DEBUG ){
    util.log("evaluate action",JSON.stringify(data));
  }

  var cmd = controller.actionObjects_[ data[data.length-1] ];
  cmd.action.apply( cmd, data );
  
  return data;
};