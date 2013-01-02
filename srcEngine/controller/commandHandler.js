controller.commands = {};

controller.commandBuffer = util.createRingBuffer( 200 );

/**
 * Registers a command description.
 *
 * @param options
 */
controller.registerCommand = function( options ){
  if( DEBUG && !util.isString( options.key ) ) util.illegalArgumentError();
  if( DEBUG && !util.isFn( options.action ) ) util.illegalArgumentError();
  if( DEBUG && !util.isFn( options.condition ) ) util.illegalArgumentError();

  // DEFAULT OPTIONS
  var impl = {
    prepareMenu:     null,
    prepareTargets:  null,
    localAction:     false,
    multiStepAction: false,
    condition:       util.FUNCTION_TRUE_RETURNER
  };

  // MIXIN OPTIONS
  var key = options.key;
  var keys = Object.keys( options );
  for( var i=0,e=keys.length; i<e; i++ ){
    impl[ keys[i] ] = options[ keys[i] ];
  }

  controller.commands[ key ] = impl;
};

/**
 * Directly invokes the action phase of a command.
 *
 * @param data action data array
 * @param cKey action key ( optional, default value is data.getAction() )
 */
controller.invokeCommand = function( data, cKey ){
  if( arguments.length === 1 ) cKey = data.getAction();

  if( DEBUG && !util.isString( cKey ) ) util.illegalArgumentError();
  if( DEBUG && !util.isDefined( data ) ) util.illegalArgumentError();

  var cmd = controller.commands[ cKey ];

  // MOVE IT
  if( data.getMovePath() !== null ){
    controller.commands[ "move" ].action.apply( cmd, [data] );
  }

  // DO IT
  cmd.action.apply( cmd, [data] );
};

controller.isNetworkGame = function(){
  return false; //controller.online;
};

controller._parseNetworkMessage = function( msg ){
  // controller.commandBuffer.push( JSON.parse( msg ) );
  // GET DATA ARRAY
  // GET ACTION DATA OBJECT
  // INJECT DATA
  // ADD INTO BUFFER
  util.unexpectedSituationError();
};

controller._sendNetworkMessage = function( msg ){
  // GET DATA ARRAY
  // SEND DATA ARRAY
  util.unexpectedSituationError();
};

controller.pushActionDataIntoBuffer = function( data, local ){
  if( DEBUG ){
    util.logInfo(
      "pushing command into buffer...\n",

      "source (" ,data.getSourceX(), "," ,data.getSourceY(), ")\n",
      "target (" ,data.getTargetX(), "," ,data.getTargetY(), ")\n",
      "action target (" ,data.getActionTargetX(),",",data.getActionTargetY(),")\n",

      "selected unit id" ,data.getSourceUnitId(), "\n",
      "selected property id" ,data.getSourcePropertyId(), "\n",

      "target unit id" ,data.getTargetUnitId(), "\n",
      "target property id" ,data.getTargetPropertyId(), "\n",

      "selected action" ,data.getAction(), "\n",
      "sub menu action" ,data.getSubAction(), "\n",

      "move path",data.getMovePath()
    );
  }

  controller.commandBuffer.push( data );

  if( local !== true && this.isNetworkGame() ){
    var cmd = controller.commands[ data.getAction() ];
    if( cmd.localAction !== false ) this._sendNetworkMessage( data );
  }
};

controller.getActionObject = function( actionKey ){
  return controller.commands[actionKey];
};

controller.isBufferEmpty  = function(){
  return controller.commandBuffer.isEmpty();
};

controller.evalNextMessageFromBuffer = function (){
  if( controller.commandBuffer.isEmpty() ) return null;

  var data = controller.commandBuffer.pop();
  if( DEBUG ){
    util.logInfo(
      "pushing command into buffer...\n",

      "source (" ,data.getSourceX(), "," ,data.getSourceY(), ")\n",
      "target (" ,data.getTargetX(), "," ,data.getTargetY(), ")\n",
      "action target (" ,data.getActionTargetX(),",",data.getActionTargetY(),")\n",

      "selected unit id" ,data.getSourceUnitId(), "\n",
      "selected property id" ,data.getSourcePropertyId(), "\n",

      "target unit id" ,data.getTargetUnitId(), "\n",
      "target property id" ,data.getTargetPropertyId(), "\n",

      "selected action" ,data.getAction(), "\n",
      "sub menu action" ,data.getSubAction(), "\n",

      "move path",data.getMovePath()
    );
  }

  controller.invokeCommand( data );
  return data;
};