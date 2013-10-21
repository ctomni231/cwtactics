util.scoped(function(){

  function clientNeedsToImplementMe( name ){
    var msg = "client has to implement interface "+name;
    return function(){
      model.errorClient("interfaces",msg);
    };
  }
  
  // ### Controller.isNetworkGame
  // Returns true if the current session a network session, else false.
  //
  controller.isNetworkGame = clientNeedsToImplementMe("controller.isNetworkGame");
  
  // ### Controller.isHost
  // Returns true if the client is the host instance of a game round.
  //
  controller.isHost = clientNeedsToImplementMe("controller.isHost");
  
  // ### Controller.parseNetworkMessage
  // Parses a network message and invokes the action stack with the decoded message as argument.
  //
  controller.parseNetworkMessage = clientNeedsToImplementMe("controller.parseNetworkMessage");
  
  // ### Controller.sendNetworkMessage
  // Encodes an argument array and sends it to the server instance.
  //
  controller.sendNetworkMessage = clientNeedsToImplementMe("controller.sendNetworkMessage");
	
});
