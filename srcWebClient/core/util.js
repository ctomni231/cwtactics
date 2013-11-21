// Creates a scope that can be called only once.
//
util.singleLazyCall = function( fn ){
  var called = false;
  return function(){
    if( called ) assert(false,"this function cannot be called twice");
    //called = true;
    
    fn.apply( null, arguments );
  };
};

// Appends a callback to be called with every element of a given list.
//
util.iterateListByFlow = function( flow, list, cb ){

  var data = {
    i:0,list:list
  };

  // load elements
  for( var i=0,e=list.length; i<e; i++ ){
    flow.andThen(cb,data);
  }

  // check some things
  flow.andThen(function(data){
    assert(list   === data.list);
    assert(data.i === data.list.length);
  },data);
};