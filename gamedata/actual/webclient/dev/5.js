// Creates a scoped context by calling the callback immediatetly after the 
// `util.scoped` is called.
//
// @param {Function} cb call back function that will be invoked in the created scope
util.scoped = function( cb ){
  return cb();
};