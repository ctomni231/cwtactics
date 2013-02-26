/**
 * Wrapper object to make actions locally callable without invoking a transaction context nor being
 * evaluated over the action stack.
 * 
 * Note that the client expects actions to be invoked over the action stack. Only smaller actions like
 * wait should be invoked directly, all other things should be pushed into the action stack.
 * 
 * @namespace
 */
controller.actions = {};

/** 
 * Contains all known action objects.
 *  
 * @private 
 */
controller.actionObjects_ = {};

/**
 * Registers an internal non user callable action.
 *
 * @param impl action implementation
 */
controller.engineAction = function( impl ){
  
  // CHECKS
  if( !impl.hasOwnProperty("key") ) util.raiseError("action key isn't defined");
  if( controller.actionObjects_.hasOwnProperty( impl.key ) ) util.raiseError("action key is already registered");
  if( !impl.hasOwnProperty("name") ) util.raiseError("action name isn't defined");
  if( !impl.hasOwnProperty("action") ) util.raiseError("action implementation isn't defined");
  if( !impl.hasOwnProperty("condition") ) impl.condition = false;
  if( !impl.hasOwnProperty("shared") ) impl.shared = false;
  
  // REGISTER PROGRAMATIC LINK
  var key = impl.key;
  controller.actions[ impl.name ] = function(){
    var cmd = controller.actionObjects_[ key ];
    cmd.action.apply( cmd, arguments );
  };
  
  controller.actionObjects_[ key ] = impl;
};

/**
 * Registers an user callable action.
 *
 * @param impl action implementation
 */
controller.userAction = function( impl ){
  
  // CHECKS
  if( !impl.hasOwnProperty("condition") ) impl.condition = util.FUNCTION_TRUE_RETURNER;
  if( !impl.hasOwnProperty("prepareMenu") ) impl.prepareMenu = null;
  if( !impl.hasOwnProperty("prepareTargets") ) impl.prepareTargets = null;
  if( !impl.hasOwnProperty("isTargetValid") ) impl.isTargetValid = null;
  if( !impl.hasOwnProperty("multiStepAction") ) impl.multiStepAction = false;
  if( !impl.hasOwnProperty("shared") ) impl.shared = true;
  if( impl.prepareTargets !== null && !impl.hasOwnProperty("targetSelectionType") ) impl.targetSelectionType = "A";
  
  if( !impl.hasOwnProperty("createDataSet") ) util.raiseError("action data set creation handler isn't defined");
  if( impl.prepareTargets !== null && impl.isTargetValid !== null ){
    util.raiseError("only one selection type can be used in an action");
  }
  
  controller.engineAction( impl );
};

/**
 * A client action is always a locally invoked action.
 * 
 * @param impl action implementation
 */
controller.clientAction = function( impl ){
  impl.shared = false;
  
  controller.userAction( impl );
};

/**
 * Returns an action object for a given action key.
 * 
 * @param {String} actionKey action key
 */
controller.getActionObject = function( actionKey ){
  return controller.actionObjects_[actionKey];
};