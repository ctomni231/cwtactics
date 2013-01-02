util.FUNCTION_TRUE_RETURNER = function(){ return true; };
util.FUNCTION_FALSE_RETURNER = function(){ return false; };

/**
 * Serializes a javascript object to a JSON specification compatible string.
 *
 * @param o
 */
util.objectToJSON = function( o ){
  return JSON.stringify(o);
};

/**
 *
 * @param ns
 * @param factory {function( function )}
 */
util.replaceFunction = function( ns, factory ){

  // SEARCH OBJECT
  var lookup = ns.split(".");
  var cobj = window;
  for( var i=0,e=lookup.length; i<e-1; i++ ){

    cobj = cobj[ lookup[i] ];
    if( cobj === undefined ){
      throw Error("illegal given namespace: does not exists");
    }
  }

  var lastName = lookup[ lookup.length -1 ];
  var fn = cobj[ lastName ];

  if( typeof fn !== 'function' ){
    throw Error("target object needs to be a function");
  }

  // SET NEW FN
  var res = factory( fn );
  if( typeof res !== 'function' ){
    throw Error("replacer factory needs to return a function");
  }
  cobj[ lastName ] = res;
};