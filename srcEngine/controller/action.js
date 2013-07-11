// Holds the identical number to action name map.
//
controller.actionMap = {};

// Holds the action name to action identical number map.
//
controller.actionIdMap = {};

// Contains all known action objects.
//
controller.actionObjects = {};

// Action buffer object that holds all actions that aren't invoked yet.
//
controller.actionBuffer_ = util.createRingBuffer( constants.ACTIONS_BUFFER_SIZE );

// Registers an user callable action.
//
// @param {Object} impl action implementation
// @private
//
controller.defineAction_ = function( impl ) {
  
  // check action parameters
  
  if (!impl.hasOwnProperty("condition")) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.ACTION_CONDITION_MISSING
  );
  
  if (!impl.hasOwnProperty("key")) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.ACTION_KEY_MISSING
  );
  
  if (!impl.hasOwnProperty("invoke")) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.ACTION_IMPLEMENTATION_MISSING
  );
  
  if (controller.actionObjects.hasOwnProperty(impl.key)) model.criticalError(
    constants.error.ILLEGAL_PARAMETERS, 
    constants.error.ACTION_KEY_ALREADY_DEFINED
  );
  
  if (!impl.hasOwnProperty("prepareMenu")) impl.prepareMenu = null;
  if (!impl.hasOwnProperty("prepareTargets")) impl.prepareTargets = null;
  if (!impl.hasOwnProperty("isTargetValid")) impl.isTargetValid = null;
  if (!impl.hasOwnProperty("multiStepAction")) impl.multiStepAction = false;
  if (impl.prepareTargets !== null && !impl.hasOwnProperty("targetSelectionType")) impl.targetSelectionType = "A";
  
  if (impl.prepareTargets !== null && impl.isTargetValid !== null) {
    model.criticalError(
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.ACTION_ONLY_ONE_SELECTION_TYPE
    );
  } 
  
  // register programatic link
  controller.actionObjects[ impl.key ] = impl;
};

// Registers an user callable unit action.
//
// @param {Object} impl action implementation
//
controller.unitAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = true;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

// Registers an user callable property action.
//
// @param {Object} impl action implementation
//
controller.propertyAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = false;
  impl.propertyAction = true;
  controller.defineAction_(impl);
};

// Registers an user callable map action. A map action
// is only possible when no property and unit will 
// we selected.
//
// @param {Object} impl action implementation
//
controller.mapAction = function( impl ){
  impl.mapAction = true;
  impl.unitAction = false;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

// Creates an action call array for the command stack.
//
// @param {String} key action function name
// @param {Array} args function arguments
//
controller.getInvokementArguments = function( key, args ){
  var result = [];
  
  // add arguments
  for( var i=0,e=args.length; i<e; i++ ) result[i] = args[i];
  
  // append action key
  result[ result.length ] = key;
  
  return result;
};

// Invokes an action function locally by the action 
// stack.
//
// @param {String} key action function name
// @param {Array} args function arguments
//
controller.localInvokement = function( key, args ){
  if( (arguments.length === 2 && !controller.actionIdMap[key] ) || 
      !controller.actionIdMap[ key[key.length-1] ] ){
    
    model.criticalError(
      constants.error.ILLEGAL_DATA,
      constants.error.NON_ACTION_CALL_FUNCTION
    );
  }
  
  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.getInvokementArguments(key,args);
  
  if( constants.DEBUG ){
    util.log(
      "adding",
      JSON.stringify(key),
      "to the command stack as",
      controller.actionMap[this.__actionId__],
      "command"
    );
  }
  
  // push to stack
  controller.actionBuffer_.push( key );
};

// Invokes an action function shared by the action 
// stack.
//
// @param {String} key action function name
// @param {Array} args function arguments
//
controller.sharedInvokement = function( key, args ){
  if( (arguments.length === 2 && !controller.actionIdMap[key] ) || 
      !controller.actionIdMap[ key[key.length-1] ] ){
    
    model.criticalError(
      constants.error.ILLEGAL_DATA,
      constants.error.NON_ACTION_CALL_FUNCTION
    );
  }
  
  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.getInvokementArguments(key,args);
  
  if( controller.isNetworkGame() ){
    
    // share message when the active session
    // is a network game
    controller.sendNetworkMessage( JSON.stringify(key) );
  }
  
  // append call locally
  controller.localInvokement(key);
};

util.scoped(function(){
  var id = 0;
  
  // Registers an invokable command.
  //
  // @param {String} name action function name
  //
  controller.registerInvokableCommand = function( name ){
    if( !util.expectFunction( model, name, true ) ){
      model.criticalError(
        constants.error.ILLEGAL_DATA,
        constants.error.NON_MODEL_FUNCTION
      );
    }
    
    controller.actionMap[id.toString()] = name;
    controller.actionIdMap[name]        = id.toString();
    
    // increase counter
    id++;
  };
  
});