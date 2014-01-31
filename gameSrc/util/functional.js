var emptyFn = function(){};

cwt.doObjectCheck = function ( obj, checkFn ) {
  var keys = Object.keys(obj);
  for( var i= 0,e=keys.length; i<e; i++ ){
    checkFn( keys[i], obj[keys[i]] );
  }
};

cwt.doListCheck = function ( list, checkFn ) {
  for( var i= 0,e=list.length; i<e; i++ ){
    checkFn( list[i] );
  }
};