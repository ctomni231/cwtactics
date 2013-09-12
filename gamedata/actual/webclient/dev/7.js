// Raises an error in the active Javascript environment.
// 
util.createCwtErrorObject = function( errorId, errorData, stackData ){
  var e = Error( constants.ERROR_MSG );
  
  e.errorID = errorId;
  e.errorDataID = errorData;
  e.errorActionData = stackData;
  
  return e;
};

// Raises an error in the active Javascript environment.
// 
util.error = function( errorId, errorData, stackData ){
  console.error( util.createCwtErrorObject(errorId, errorData, stackData) );
};

// Logging function.
// 
// @param {...Object} msg A number of arguments that will be used as message.
//                        If an argument isn't a String then it will be converted to
//                        String by the toString() function.
util.log = function( msg ){
  if( arguments.length > 1 ) msg = Array.prototype.join.call( arguments, " " );

  console.log( msg );
};