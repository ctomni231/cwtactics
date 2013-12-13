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
  assert( typeof v === "number" && v % 1 === 0 );
};

var assertIntRange = function( v, from, to ){
  assertInt(v);
  assert( v >= from && v <= to );
};

var assertBool = function( v ){
  assert( typeof v === "boolean" );
};

var assertStr = function( v ){
  assert( typeof v === "string" );
};

var assertList = function( v ){
  assert( Array.isArray(v) );
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
