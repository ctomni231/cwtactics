util.scoped(function(){

  function clientNeedsToImplementMe( name ){
    var msg = "client has to implement interface "+name;
    return function(){
      util.raiseError(msg);
    };
  }
  
  /**
   * Returns true if the current session a network session, else false.
   */
  controller.isNetworkGame = clientNeedsToImplementMe("controller.isNetworkGame");
  
  /**
   * Returns true if the client is the host instance of a game round.
   */
  controller.isHost = clientNeedsToImplementMe("controller.isHost");
  
  /**
   * Parses a network message and invokes the action stack with the 
   * decoded message as argument.
   * 
   * @config
   */
  controller.parseNetworkMessage = clientNeedsToImplementMe("controller.parseNetworkMessage");
  
  /**
   * Encodes an argument array and sends it to the server instance.
   *
   * @config
   */
  controller.sendNetworkMessage = clientNeedsToImplementMe("controller.sendNetworkMessage");

});