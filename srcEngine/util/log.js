/**
 * Raises an error in the active Javascript environment.
 *
 * @param {...Object} reason A number of arguments that will be used as error message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 */
util.raiseError = function( reason ){
  
  if( arguments.length === 0 ){
    reason = "CustomWars Debug:: An error was raised";
  }
  else if( arguments.length > 1 ){
    reason = Array.prototype.join.call( arguments, " " );
  }
    
  throw Error( reason );
};

/**
 * Logging function.
 *
 * @param {...Object} reason A number of arguments that will be used as message.
 *                           If an argument isn't a String then it will be converted to
 *                           String by the toString() function.
 * @config
 */
util.log = function( msg ){
  if( arguments.length > 1 ){
    msg = Array.prototype.join.call( arguments, " " );
  }

  console.log( msg );
}

/**
 * Overwritable logging function.
 *
 * @deprecated will be removed in version 0.3
 */
util.logInfo = function(){
  util.log.apply( this, arguments );
};