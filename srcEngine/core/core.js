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
var assert = function(expr,msg){
  if( !expr ){
    if( !msg ) msg = "Assertion failed";

    // raise error
    if( console.error ) console.error(msg); 
    throw new Error(msg);
  }
};