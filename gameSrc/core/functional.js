var emptyFunction = function(){};

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

cwt.traitPreventNew = function(){
  throw Error("trait cannot be instantiated");
};

/**
 *
 * @param list
 * @param forbiddenEl this element won't be returned
 * @returns random element from the list
 */
cwt.selectRandomListElement = function (list,forbiddenEl){
  if( list.length === 0 ) return null;
  if( list.length === 1 ) return list[0];

  var newIndex = parseInt(Math.random() * list.length, 10);
  if( newIndex === list.length ) newIndex = 0;
  if( list[newIndex] === forbiddenEl ) newIndex++;
  if( newIndex === list.length ) newIndex = 0;

  return list[newIndex];
};