// ### Controller.actionMap
// Holds the identical number to action name
// map.
//
controller.actionMap = {};

// ### Controller.actionIdMap
// Holds the action name to action identical
// number map.
//
controller.actionIdMap = {};

// ### Controller.actionObjects
// Contains all known action objects.
//
controller.actionObjects = {};

// ### Controller.actionBuffer_
// Action buffer object that holds all actions
// that aren't invoked yet.
//
controller.actionBuffer_ = util.createRingBuffer( ACTIONS_BUFFER_SIZE );

// ### Controller.defineAction_
// Registers an user callable action.
//
controller.defineAction_ = function( impl ){

  // check action parameters

  if( !impl.hasOwnProperty( "condition" ) ) impl.condition = null;

  if( !impl.hasOwnProperty( "key" )                       ) model.errorIllegalArguments("define action","action key missing");
  if( !impl.hasOwnProperty( "invoke" )                    ) model.errorIllegalArguments("define action","action invokement function missing");
  if( controller.actionObjects.hasOwnProperty( impl.key ) ) model.errorIllegalArguments("define action","action key is already registered");

  if( !impl.hasOwnProperty( "prepareMenu" )       ) impl.prepareMenu = null;
  if( !impl.hasOwnProperty( "prepareTargets" )    ) impl.prepareTargets = null;
  if( !impl.hasOwnProperty( "prepareSelection" )  ) impl.prepareSelection = null;
  if( !impl.hasOwnProperty( "isTargetValid" )     ) impl.isTargetValid = null;
  if( !impl.hasOwnProperty( "multiStepAction" )   ) impl.multiStepAction = false;
  if( impl.prepareTargets !== null && !impl.hasOwnProperty( "targetSelectionType" ) ) impl.targetSelectionType = "A";

  if( impl.prepareTargets !== null && impl.isTargetValid !== null ) model.errorIllegalArguments("define action","unclear selection mode");

  // register programatic link
  controller.actionObjects[ impl.key ] = impl;
};

// ### Controller.unitAction
// Registers an user callable unit action.
//
controller.unitAction = function( impl ){
  impl.mapAction = false;
  impl.clientAction = false;
  impl.unitAction = true;
  impl.propertyAction = false;
  controller.defineAction_( impl );
};

// ### Controller.propertyAction
// Registers an user callable property action.
//
controller.propertyAction = function( impl ){
  impl.mapAction = false;
  impl.clientAction = false;
  impl.unitAction = false;
  impl.propertyAction = true;
  controller.defineAction_( impl );
};

// ### Controller.mapAction
// Registers an user callable map action. A map action
// is only possible when no property and unit will 
// we selected.
//
controller.mapAction = function( impl ){
  impl.mapAction = true;
  impl.clientAction = false;
  impl.unitAction = false;
  impl.propertyAction = false;
  controller.defineAction_( impl );
};

// ### Controller.clientAction
// Registers an user callable cliebnt action.
//
controller.clientAction = function( impl ){
  impl.mapAction = false;
  impl.clientAction = true;
  impl.unitAction = false;
  impl.propertyAction = false;
  controller.defineAction_( impl );
};

// ### Controller.actionCheckKeyArgs
// Checks a key and argument array for the correctness in
// the current active code base.
//
controller.actionCheckKeyArgs = function( key, args ){
  if( (arguments.length === 2 && !controller.actionIdMap[key]) ||
      (arguments.length === 1 && !controller.actionMap[ key[key.length - 1] ] ) ) {
    model.errorIllegalArguments("actionCheckKeyArgs","key and arguments does not match data base");
  }
};

// ### Controller.getInvokementArguments
// Creates an action call array for the command stack.
//
controller.getInvokementArguments = function( key, args ){
  if( DEBUG ) controller.actionCheckKeyArgs(key,args);

  var result = [ ];

  // add arguments
  for( var i = 0, e = args.length; i < e; i++ ) result[i] = args[i];

  // append action key
  result[ result.length ] = controller.actionIdMap[key];

  return result;
};

// ### Controller.localInvokement
// Invokes an action function locally by the action 
// stack.
//
controller.localInvokement = function( key, args ){
  if( DEBUG ) controller.actionCheckKeyArgs(key,args);

  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.getInvokementArguments( key, args );

  if( DEBUG ) {
    util.log(
      "adding",
      JSON.stringify( key ),
      "to the command stack as",
      controller.actionMap[this.__actionId__],
      "command"
    );
  }

  // push to stack
  controller.actionBuffer_.push( key );
};

// ### Controller.sharedInvokement
// Invokes an action function shared by the action 
// stack.
//
controller.sharedInvokement = function( key, args ){
  if( DEBUG ) controller.actionCheckKeyArgs(key,args);

  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.getInvokementArguments( key, args );

  if( controller.isNetworkGame() ) {

    // share message when the active session
    // is a network game
    controller.sendNetworkMessage( JSON.stringify( key ) );
  }

  // append call locally
  controller.localInvokement( key );
};

// Special scope to generate unique indexes for the model functions.
//
util.scoped( function(){
  var id = 0;

  // ### Controller.registerInvokableCommand
  // Registers an invokable command.
  //
  controller.registerInvokableCommand = function( name ){
    if( !util.expectFunction( model, name, true ) ) {
      model.errorIllegalArguments(
        "register invoke cmd",
        "function signature does not exists"
      );
    }

    // register function name
    controller.actionMap[id.toString()] = name;
    controller.actionIdMap[name] = id.toString();

    // increase counter
    id++;
  };

} );
