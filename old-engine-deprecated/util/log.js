// Raises an error in the active Javascript environment.
// 
util.error = function( errorId, errorData, stackData ){
  console.log( "%cCW:T ERROR", 			"color:red;" );
  console.log( "%c .ERROR_ID:"+errorId, "color:red;" );
  console.log( "%c .DATA:"+errorData, 	"color:red;" );
  console.log( "%c .STACK:"+stackData, 	"color:red;" );
};

// Logging function.
//
util.log = function( msg ){
  if( arguments.length > 1 ) msg = Array.prototype.join.call( arguments, " " );

  console.log( msg );
};