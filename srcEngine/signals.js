/**
 * @private
 */
signal._data = {};

/**
 * Connects a listener to a channel. This function will be invoked if data will
 * be pushed through the channel by @link{signal.emit}.
 *
 * @param channel
 * @param cb
 */
signal.connect = function( channel, cb ){
  var data = signal._data;
 
  if( util.DEBUG ) util.logInfo("connect handler for "+channel);

  // CREATE CHANNEL IF IT DOES NOT EXISTS
  if( !data.hasOwnProperty(channel) ) data[channel] = [];

  // PUSH CALLBACK
  data[channel].push( cb );
};

/**
 * Removes a listener from a channel. Returns true if the callback was removed
 * from a channel, else false.
 *
 * @param channel
 * @param cb
 */
signal.disconnect = function( channel, cb ){
  var data = signal._data;

  if( !data.hasOwnProperty(channel) ) return false;

  var cbList = data[channel];
  for( var i=0,e=cbList.length; i<e; i++ ){
    if( cbList[i] === cb ){

      // CALLBACK FOUND, REMOVE IT
      cbList.splice(i,1);
      return true;
    }
  }

  // CALLBACK NOT FOUND
  return false;
};

/**
 * Pushes data into a channel. All connected listeners will be invoked with
 * the given arguments.
 *
 * @param channel
 */
signal.emit = function( channel ){
  var data = signal._data;

  if( util.DEBUG ) util.logInfo("call event "+channel);

  // CREATE CHANNEL IF IT DOES NOT EXISTS
  if( !data.hasOwnProperty(channel) ) return;

  var cbList = data[channel];
  for( var i=0,e=cbList.length; i<e; i++ ){

    // INVOKE CALLBACK
    cbList[i].apply( null, arguments );
  }
};