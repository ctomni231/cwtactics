/**
 * 
 */
controller.actionMap = {};

/** 
 * Contains all known action objects.
 *  
 * @private 
 */
controller.actionObjects = {};

/** 
 * Action buffer object that holds all actions that aren't invoked yet.
 * 
 * @private 
 */
controller.actionBuffer_ = util.createRingBuffer(CWT_ACTIONS_BUFFER_SIZE);

/**
 * Registers an user callable action.
 *
 * @param impl action implementation
 */
controller.defineAction_ = function(impl) {

  // CHECKS
  if (!impl.hasOwnProperty("condition")) util.raiseError("condition needed");
  if (!impl.hasOwnProperty("key")) util.raiseError("action key isn't defined");
  if (!impl.hasOwnProperty("invoke")) util.raiseError("action implementation isn't defined");
  
  if (controller.actionObjects.hasOwnProperty(impl.key)) util.raiseError("action key is already registered");
  
  if (!impl.hasOwnProperty("prepareMenu")) impl.prepareMenu = null;
  if (!impl.hasOwnProperty("prepareTargets")) impl.prepareTargets = null;
  if (!impl.hasOwnProperty("isTargetValid")) impl.isTargetValid = null;
  if (!impl.hasOwnProperty("multiStepAction")) impl.multiStepAction = false;
  if (impl.prepareTargets !== null && !impl.hasOwnProperty("targetSelectionType")) impl.targetSelectionType = "A";
  if (impl.prepareTargets !== null && impl.isTargetValid !== null) {
    util.raiseError("only one selection type can be used in an action");
  } 

  // REGISTER PROGRAMATIC LINK
  controller.actionObjects[ impl.key ] = impl;
};

controller.unitAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = true;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

controller.propertyAction = function( impl ){
  impl.mapAction = false;
  impl.unitAction = false;
  impl.propertyAction = true;
  controller.defineAction_(impl);
};

controller.mapAction = function( impl ){
  impl.mapAction = true;
  impl.unitAction = false;
  impl.propertyAction = false;
  controller.defineAction_(impl);
};

/** @private */
controller.callToList_ = function(){
  
  // ADD KEY
  var args = [];
  for( var i=0,e=arguments.length; i<e; i++ ) args[i] = arguments[i];
  args[ args.length ] = this.__actionId__;
    
  return args;
};

/** @private */
controller.callAsCommand_ = function(){
  
  // ADD KEY
  var args = [];
  for( var i=0,e=arguments.length; i<e; i++ ) args[i] = arguments[i];
  args[ args.length ] = this.__actionId__;
  
  if( DEBUG ){
    util.log(
      "adding",JSON.stringify(args),
      "to the command stack as",controller.actionMap[this.__actionId__],
      "command")
  }
  
  // SEND COMMAND
  if( controller.isNetworkGame() ) controller.sendNetworkMessage( JSON.stringify(args) );
  
  // REGISTER COMMAND
  controller.actionBuffer_.push( args );
};

/** @private */
controller.listenCommand_ = function(cb){
  controller.listenCommand( controller.actionMap[this.__actionId__], cb );
};

util.scoped(function(){
  var id = 0;
  var keys = Object.keys(model);
  for( var i=0,e=keys.length; i<e; i++ ){
    
    var actName = keys[i];
    var propValue = model[actName];
    if( typeof propValue === "function" ){
      propValue.__actionId__ = id.toString();
      propValue.callAsCommand = controller.callAsCommand_;
      propValue.callToList = controller.callToList_;
      propValue.listenCommand = controller.listenCommand_;
      controller.actionMap[id.toString()] =  keys[i];
      id++;
    }
  }
});

controller.localInvokement = function( key, args ){

};

controller.sharedInvokement = function( key, args ){

};