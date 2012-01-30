/**
 * Simple collection module for the neko framework.
 */

if( DEBUG ) expect("collection").not.existsAsNamespace();

function collection(){
    var res = [];
    for( var i=0, e=arguments.length; i<e; i++ ) res[i] = arguments[i];
    return res;
}

function collection_addAll(list, append){
    if(TYPED){
        expect(list,append).isArray();
    }
    
    var i = 0,
        e = append.length;
    for(; i<e; i++ ) list.push( append[i] );
}

function collection_copy(list, list2){
    if(TYPED) expect(list,append).isArray();
    
    list.splice(0,list.length);
    var i = 0,
        e = list2.length;
    for(; i<e; i++ ) list[i] = list2[i];
}

function collection_fillWithElement( list, element, start ){
    
    if( !start ) start = 0;
    var e = list.length;
    for(; start<e; start++ ) list[start] = element;
}

var collection__sliceFn = Array.prototype.slice;

/**
 * Slices a part out of an array and returns it. This implementation is uses the native
 * Array class implementation. This function can be used on arguments arrays as well.
 */
function collection_slice(array,startIndex,endIndex){
    return collection__sliceFn.apply(startIndex,endIndex)
}

/**
 * Calls a function on each element of a list.
 */
function collection_each( list, fN ){
    if( TYPED ){
        expect( list ).isArray();
        expect( fN ).isFunction();
    }
    
    var i = 0,
        e = list.length;
    for(; i<e; i++ ) fN( list[i], i, list ); // fN( element, index, array )
}

/**
 * Calls a function on each element of a list.
 */
function collection_eachInRange( list, start, end, fN ){
   
    if( TYPED ){
        expect( list ).isArray();
        expect( fN ).isFunction();
    }
    
    // check index parameters
    if( DEBUG ){
        expect(start).ge(0).lt(end);
        expect(end).gt(start).lt(list.length);
    }
    
    for(; start<end; start++ ) fN( list[start], start, list );
}

/**
 * Returns a simple enumeration object of a given list of strings.
 * This function uses identical id numbers as values for the given enumeration keys.
 */
function collection_enum(){

    if( typeof arguments[0] === 'string' ){
      if( TYPED ) expect(arguments).each.isString();
      
      var result = {};
      for( var i=0, e=arguments.length; i<e; i++ ) result[ arguments[i] ] = i;
      
      // values contains all enumeration values
      result.__values__ = [];
      collection_copy( result.__values__, arguments );
      
      return result;
    }
    else return arguments[0];
}