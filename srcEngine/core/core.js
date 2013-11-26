// Model namespace. Holds the complete game model.
//
var model = {};

// Controller namespace. Holds different functions that aren't connected directly to the model.
//
var controller = {};

// Utility namespace.
//
var util = {};

// Assertion. 
//
var assert = function(expr,msgA){
  if( !expr ){
    if( typeof msgA === "undefined" ) msgA = "FAIL";

    if( console.error ) console.error(msgA);

    // raise error
    throw new Error(msgA);
  }
};