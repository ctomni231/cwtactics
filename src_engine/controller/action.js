// Contains all known action objects.
//
controller.action_objects = {};

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

  // register stuff
  controller.action_objects[  impl.key ] = impl;
  if( !impl.noImplictEvents ){
    model.event_define(impl.key+"_check");
    model.event_define(impl.key+"_invoked");
  }
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
