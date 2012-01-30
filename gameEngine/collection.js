/**
 * Simple collection module for the neko framework. It contains some useful functions to work with arrays and 
 * collections.
 * 
 * SINCE: 30.01.12
 */

if( DEBUG ) expect("collection").not.existsAsNamespace();

/**
 * Converts the arguments of the function to an array and returns it.
 */
function collection(){
    
    var res = [];
    var i=0, e=arguments.length;
    for(; i<e; i++ ) res[i] = arguments[i];
    return res;
}

/**
 * Adds all elements from append to list.
 */
function collection_addAll(list, append){
    if( DEBUG ){
        expect(list).isArray();
        expect(append).isArray();
    }
    
    var i = 0, e = append.length;
    for(; i<e; i++ ) list.push( append[i] );
}

/**
 * Copies all elements from one array to an other. This functions not adds the elements, it copies the whole array. 
 * After call of this function the following is true:
 *  - for index of list => list[index] === list2[index]
 *  - list.length === list2.length
 *  - list !== list2
 *  
 * @param list {array} target array
 * @param list2 {array} source array
 */
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

/**
 * Creates an array of structs. This function creates the array and fills it with empty struct objects.
 */
function collection_fixedStructArray( structName, size ){
    if( DEBUG ){
        expect( structName ).isString().size.gt(0);
        expect( size ).isInteger().gt(0);
    }
    
    var a = [];
    for( var i=0; i<size; i++ ) a[i] = neko_structObject(structName);
    a.__struct__ = "StructArray";
    
    return a;
}

/**
 * Creates a simple matrix by creating a top array and sub arrays for the second dimensions. The sub dimension will be 
 * empty.
 */
function collection_matrix( width ){
    if( DEBUG ){
        expect( width ).isInteger().gt(0);
    }
    
    var a = [];
    for( var i=0; i<width; i++ ) a[i] = [];
    
    return a;
}

/**
 * Clears an array. Uses array.splice method to realize it.
 */
function collection_clear( array ){
    array.splice(0);
}