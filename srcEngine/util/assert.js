// Asserts that `expr` is true. If `expr` is false then an
// Error will be thrown.
//
var assert = function(expr,msgA){
  if( !expr ){
    if( typeof msgA === "undefined" ) msgA = "FAIL";

    if( console.error ) console.error(msgA);

    // raise error
    throw new Error(msgA);
  }
};

// Asserts that `v` is a function.
//
var assertFn = function( v ){
  assert( typeof v === "function" );
};

// Asserts that `v` is an integer.
//
var assertInt = function( v ){
  assert( typeof v === "number" && v % 1 === 0 );
};

// Asserts that `v` is an integer and in a given intervall.
//
var assertIntRange = function( v, from, to ){
  assertInt(v);
  assert( v >= from && v <= to );
};

// Asserts that `v` is a boolean.
//
var assertBool = function( v ){
  assert( typeof v === "boolean" );
};

// Asserts that `v` is a string.
//
var assertStr = function( v ){
  assert( typeof v === "string" );
};

// Asserts that `v` is a list.
//
var assertList = function( v ){
  assert( Array.isArray(v) );
};

// Asserts that `v` is defined.
//
var assertDef = function( v ){
  assert( typeof v !== "undefined" );
};

// Asserts that `v` is undefined.
//
var assertUndef = function( v ){
  assert( typeof v === "undefined" );
};

// Asserts that `v` is null.
//
var assertNull = function( v ){
  assert( v === null );
};

// Asserts that `v` is not null.
//
var assertNotNull = function( v ){
  assert( v !== null );
};
