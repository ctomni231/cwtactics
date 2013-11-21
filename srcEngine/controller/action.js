// Holds the identical number to action name map.
//
controller.action_map = {};

// Holds the action name to action identical number map.
//
controller.action_idmap = {};

// Contains all known action objects.
//
controller.action_objects = {};

// Action buffer object that holds all actions
// that aren't invoked yet.
//
controller.action_buffer_ = util.createRingBuffer( ACTIONS_BUFFER_SIZE );

// Registers an user callable action.
//
controller.action_define_ = function( impl ){

  if( !impl.hasOwnProperty( "condition" ) ) impl.condition = null;

  // check action parameters
  assert( impl.hasOwnProperty( "key" ) );
  assert( impl.hasOwnProperty( "invoke" ) );
  assert( !controller.action_objects.hasOwnProperty( impl.key ) );

  if( !impl.hasOwnProperty( "prepareMenu" )       ) impl.prepareMenu = null;
  if( !impl.hasOwnProperty( "prepareTargets" )    ) impl.prepareTargets = null;
  if( !impl.hasOwnProperty( "prepareSelection" )  ) impl.prepareSelection = null;
  if( !impl.hasOwnProperty( "isTargetValid" )     ) impl.isTargetValid = null;
  if( !impl.hasOwnProperty( "multiStepAction" )   ) impl.multiStepAction = false;
  if( impl.prepareTargets !== null && !impl.hasOwnProperty( "targetSelectionType" ) ){
    impl.targetSelectionType = "A";
  }

  assert( impl.prepareTargets === null || impl.isTargetValid === null );

  // register link
  controller.action_objects[ impl.key ] = impl;
};

// Registers an user callable unit action.
//
controller.action_unitAction = function( impl ){
  impl.mapAction        = false;
  impl.clientAction     = false;
  impl.unitAction       = true;
  impl.propertyAction   = false;
  controller.action_define_( impl );
};

// Registers an user callable property action.
//
controller.action_propertyAction = function( impl ){
  impl.mapAction        = false;
  impl.clientAction     = false;
  impl.unitAction       = false;
  impl.propertyAction   = true;
  controller.action_define_( impl );
};

// Registers an user callable map action. A map action is only possible when no property and
// unit will we selected.
//
controller.action_mapAction = function( impl ){
  impl.mapAction        = true;
  impl.clientAction     = false;
  impl.unitAction       = false;
  impl.propertyAction   = false;
  controller.action_define_( impl );
};

// Registers an user callable client action.
//
controller.action_clientAction = function( impl ){
  impl.mapAction        = false;
  impl.clientAction     = true;
  impl.unitAction       = false;
  impl.propertyAction   = false;
  controller.action_define_( impl );
};

// Checks a key and argument array for the correctness in the current active code base.
//
controller.action_checkInvokeArgs = function( key, args ){
  assert( !(
    (arguments.length === 2 && !controller.action_idmap[key]) ||
    (arguments.length === 1 && !controller.action_map[ key[key.length - 1] ] )
   ));
};

// Creates an action call array for the command stack.
//
controller.action_convertToInvokeDataArray = function( key, args ){
  controller.action_checkInvokeArgs(key,args);

  var result = [ ];

  // add arguments
  for( var i = 0, e = args.length; i < e; i++ ) result[i] = args[i];

  // append action key
  result[ result.length ] = controller.action_idmap[key];

  return result;
};

// Invokes an action function locally by the action stack.
//
controller.action_localInvoke = function( key, args ){
  controller.action_checkInvokeArgs(key,args);

  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.action_convertToInvokeDataArray( key, args );

  if( DEBUG ) {
    util.log(
      "adding",
      JSON.stringify( key ),
      "to the command stack as",
      controller.action_map[ key[key.length-1] ],
      "command"
    );
  }

  // push to stack
  controller.action_buffer_.push( key );
};

// Invokes an action function shared by the action stack.
//
controller.action_sharedInvoke = function( key, args ){
  controller.action_checkInvokeArgs(key,args);

  // generate arguments for action call
  if( arguments.length === 2 ) key = controller.action_convertToInvokeDataArray( key, args );

  if( controller.isNetworkGame() ) {

    // share message when the active session
    // is a network game
    controller.sendNetworkMessage( JSON.stringify( key ) );
  }

  // append call locally
  controller.action_localInvoke( key );
};

// Special scope to generate unique indexes for the model functions.
//
util.scoped( function(){
  var id = 0;

  // Registers an invokable command.
  //
  controller.action_registerCommands = function( name ){

    // register function name
    controller.action_map[id.toString()]  = name;
    controller.action_idmap[name]         = id.toString();

    // increase counter
    id++;
  };

} );
