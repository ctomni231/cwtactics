// Creates a scoped context by calling the callback immediatetly after the 
// `util.scoped` is called.
//
// @param {Function} cb call back function that will be invoked in the created scope
util.scoped = function( cb ){
  return cb();
};

util.hasProperties = function( obj ){
  for( var i=1, e=arguments.length; i<e; i++ ){
    if( !obj.hasOwnProperty( arguments[i] ) ){
      util.raiseError("missing property",arguments[i]);
    }
  }
};

util.objToList = function( obj, propList ){
  var r = [];
  
  for( var i=1, e=propList.length; i<e; i++ ){
    r[ i-1 ] = obj[ propList[i] ];
  }
  
  return r;
};

util.listToObj = function( list, propList, obj ){
  if( list.length !== propList.length ){
    util.raiseError("property list and data list does not have the same length");
  }
    
  for( var i=1, e=list.length; i<e; i++ ){
    obj[ propList[i] ] = list[i];
  }
};