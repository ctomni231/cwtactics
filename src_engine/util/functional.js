 // Creates a scoped context by calling the callback immediatetly after the
// `util.scoped` is called.
//
util.scoped = function( cb ){
  return cb();
};

util.wish = function(){
  return {
    declined : false,
    approve  : function(){ this.declined = false; },
    decline  : function(){ this.declined = true;  }
  };
};

util.copy = function( from ){
  var to = {};
  var list = Object.keys(from);
  for( var i=0,e=list.length; i<e; i++ ){
    var key = list[i];
    to[key] = from[key];
  }

  return to;
};

// True when value is an integer.
//
util.isUndefined = function(value){
  return ( typeof value === "undefined" );
};

// True when value is an integer.
//
util.isString = function(value){
  return ( typeof value === "string" );
};

// True when value is a boolean.
//
util.isBoolean = function(value){
  return ( typeof value === "boolean" );
};

// True when value is a function.
//
util.isFunction = function(value){
  return ( typeof value === "function" );
};

// True when value is an object.
//
util.isObject = function(value){
  return typeof value === "object";
};

// True when value is an integer.
//
util.isInt = function(value){
  return (
    typeof value === "number" &&
    value % 1 === 0
  );
};

// True when `from >= value <= to` and value is an integer.
//
util.intRange = function(value,from,to){
  return (
    typeof value === "number" &&
    value % 1 === 0 &&
    value >= from &&
    value <= to
  );
};
