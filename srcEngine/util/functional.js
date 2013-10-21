// Creates a scoped context by calling the callback immediatetly after the 
// `util.scoped` is called.
//
// @param {Function} cb call back function that will be invoked in the created scope
util.scoped = function( cb ){
  return cb();
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
