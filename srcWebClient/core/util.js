/**
 * 
 * @param {function} fn
 * @returns {function} returns a new function that only allows to call fn one time
 */
util.singleLazyCall = function( fn ){
  var called = false;
  return function(){
    if( called ) util.raiseError("this function cannot be called twice");
    //called = true;
    
    fn.apply( null, arguments );
  };
};