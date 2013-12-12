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

var assertFn = function( v ){
  assert( typeof v === "function" );
};

var assertInt = function( v ){
  assert( typeof value === "number" && value % 1 === 0 );
};

var assertBool = function( v ){
  assert( typeof v === "boolean" );
};

var assertStr = function( v ){
  assert( typeof v === "string" );
};

var assertDef = function( v ){
  assert( typeof v !== "undefined" );
};

var assertUndef = function( v ){
  assert( typeof v === "undefined" );
};

var assertNull = function( v ){
  assert( v === null );
};

var assertNotNull = function( v ){
  assert( v !== null );
};