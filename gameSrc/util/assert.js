/**
 * Asserts that `expr` is true. If `expr` is false 
 * then an Error will be thrown.
 */
var assert = function(expr,msgA){
  if( !expr ){
    if( typeof msgA === "undefined" ) msgA = "FAIL";

    if( console.error ) console.error(msgA);

    // raise error
    throw new Error(msgA);
  }
};