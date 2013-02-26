/**
 * Returns true if the current session a network session, else false.
 */
controller.isNetworkGame = function(){
  return false;
};

/**
 * Parses a network message and invokes the action stack with the 
 * decoded message as argument.
 * 
 * @config
 */
controller._parseNetworkMessage = function( msg ){
  //var data = JSON.parse( msg );
  util.unexpectedSituationError();
};

/**
 * Encodes an argument array and sends it to the server instance.
 *
 * @config
 */
controller.sendNetworkMessage_ = function( args ){
  //var msg = JSON.stringify( arguments );
  util.unexpectedSituationError();
};
