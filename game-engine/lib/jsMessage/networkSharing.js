/**
 * Simple networking filter that shares incoming messages through an network object. In a clean web browser based
 * javaScript environment this should be an instance of a WebSocket specification.
 *
 * @since 21.04.2012
 * @author BlackCat (blackcat.myako@gmail.com)
 * @param netObject network message broker instance
 * @param toggleAble if true, the filter can be enabled/disabled at runtime
 */
jsMessage.filter.networkSharing = function( netObject, toggleAble ){

  var enabled = true;

  // simply sends all incoming messages over the network object
  var API = {

    setNetworkObject: function( netObj ){
      netObject = netObj;
    },

    isEnabled: function(){
      return enabled;
    },

    filter: function( args ){
      //TODO mark argument object as network message to prevent resending of other clients
      //netObject.send( JSON.stringify( args ) );

      netObject.send( JSON.stringify({
        networkMessage: true,
        arguments: args
      }));
    }
  };

  // make toggle able, if wanted
  if( toggleAble === true ){
    API.disable = function(){ enabled = false; };
    API.enable = function(){ enabled = true; };
  }

  return API;
};