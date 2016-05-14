// Asserts that `expr` is true. If `expr` is false then an
// Error will be thrown.
//
assert = function(expr,msgA){
  if( !expr ){
    if( typeof msgA === "undefined" ) msgA = "FAIL";

    if( console.error ) console.error(msgA);

    // raise error
    throw new Error(msgA);
  }
};

// Asserts that `v` is a function.
//
assertFn = function( v ){
  assert( typeof v === "function" );
};

// Asserts that `v` is an integer.
//
assertInt = function( v ){
  assert( typeof v === "number" && v % 1 === 0 );
};

// Asserts that `v` is an integer and in a given intervall.
//
assertIntRange = function( v, from, to ){
  assertInt(v);
  assert( v >= from && v <= to );
};

// Asserts that `v` is a boolean.
//
assertBool = function( v ){
  assert( typeof v === "boolean" );
};

// Asserts that `v` is a string.
//
assertStr = function( v ){
  assert( typeof v === "string" );
};

// Asserts that `v` is a list.
//
assertList = function( v ){
  assert( Array.isArray(v) );
};

// Asserts that `v` is defined.
//
assertDef = function( v ){
  assert( typeof v !== "undefined" );
};

// Asserts that `v` is undefined.
//
assertUndef = function( v ){
  assert( typeof v === "undefined" );
};

// Asserts that `v` is null.
//
assertNull = function( v ){
  assert( v === null );
};

// Asserts that `v` is not null.
//
assertNotNull = function( v ){
  assert( v !== null );
};
