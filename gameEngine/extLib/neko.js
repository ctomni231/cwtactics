(function(){
    
    var moduleCache = {};
    
    needDepedency = function( depID ){
    
    }
    
})();

exports.run = function(){};

var dropinRequire	= function(moduleId){
	if( moduleId in dropinRequire.cache )	return dropinRequire.cache[moduleId]
	var req	= new XMLHttpRequest();
	req.open('GET', moduleId, false);
	req.send(null);
	if(req.status != 200)	throw new Error(req)
	var txt	= dropinRequire.prefix + req.responseText + dropinRequire.suffix;
	return dropinRequire.cache[moduleId] = eval(txt);
}
dropinRequire.cache	= {};
dropinRequire.prefix	= "(function(){"+
			"	var _module	= { exports: {} };"+
			"	var _require	= function(moduleId){"+
			"		return dropinRequire(moduleId)"+
			"	};"+
			"	(function(module, exports, require){";
			// Here goes the javascript with commonjs modules
dropinRequire.suffix	= "	})(_module, _module.exports, _require);"+
			"	return _module.exports;"+
			"})();";

// to handle the replacement of "require" function
// - TODO do i need a global
dropinRequire.prevRequire	= require;
/**
 * dropinRequire.noConflict
 * - attemps to make a jQuery-like noConflict
 * - check and make it work
*/
dropinRequire.noConflict	= function(){	// no removeAll ?
	require	= dropinRequire.prevRequire;
	return dropinRequire;
}
var require	= dropinRequire;

/* 
 * @MODULE EXPECTIONS
 * @DESC Functions to realise some basic expections checks... useful for BDD.
 * @SINCE 31.01.12
 */

/**
 * Expect class, that contains a value.
 */
function neko_expect_Expect( value ){
    this.value = value;
}

neko_expect_Expect.prototype = { 
    not: {},
    size: {}
}

/**
 * Registers a matcher in the expect class.
 */
function neko_expect_registerMatcher( name, fN, notAble, sizeAble ){
    
    neko_expect_Expect.prototype[name] = function(){
        if( fN.apply(this, arguments) === false ) 
            neko_expectionError("matcher "+name+" failed on value "+this.value);
        
        return this;
    }
    
    // not statement
    if( notAble === true ){
        neko_expect_Expect.prototype.not[name] = function(){
            if( fN.apply(this, arguments) === true ) 
                neko_expectionError("matcher "+name+" failed on value "+this.value);
            
            return this;
        }
    }
    
    // size statement
    if( sizeAble === true ){
        neko_expect_Expect.prototype.size[name] = function(){
            
            var tmp = this.value; // remember old
            this.value = this.value.length;
            
            if( fN.apply(this, arguments) === false ) 
                neko_expectionError("matcher "+name+" failed on value "+this.value);
            
            this.value = tmp;
            return this;
        }
    }
}

/**
 * Throws an expection error. Normally used by the neko_expect function, if a matcher expection failed.
 */
function neko_expectionError(msg){
    
    if( DEBUG ) log_error("ExpectionError; "+msg);
    
    throw Error("ExpectionError; "+msg);
}

/**
 * Generates an expection object with a value.
 */
function neko_expect( value ){
    return new neko_expect_Expect(value);
}

// predefined matchers
neko_expect_registerMatcher("isString", function(){return typeof this.value === 'string';},true);
neko_expect_registerMatcher("isNumber", function(){return typeof this.value === 'number';},true);
neko_expect_registerMatcher("isInteger", function(){var n = this.value;return typeof n === 'number' && n%1 === 0;},true);
neko_expect_registerMatcher("isPropertyOf", function( obj ){return typeof obj[this.value] !== 'undefined';},true);
neko_expect_registerMatcher("ge", function(n){return this.value >= n;},true,true);
neko_expect_registerMatcher("gt", function(n){return this.value > n;},true,true);
neko_expect_registerMatcher("lt", function(n){return this.value < n;},true,true);
neko_expect_registerMatcher("le", function(n){return this.value <= n;},true,true);


/* 
 * @MODULE LOGGING
 * @DESC 
 * @SINCE 31.01.12
 */

if( DEBUG ) expect("log").not.isExistingNamespace() 

/**
 * Logs an normal message.
 */
function log_info( msg ){ 
    console.log( (new Date())+" INFO:: "+msg); 
}

/**
 * Logs a waring message.
 */
function log_warn( msg ){ 
    console.log( (new Date())+" WARN:: "+msg); 
}

/**
 * Logs an error message.
 */
function log_error( msg ){ 
    console.log( (new Date())+" ERROR:: "+msg); 
}


/* 
 * @MODULE CLASS AND STRUCTURES
 * @DESC Functions to handle structures and classes.
 * @SINCE 31.01.12
 */

var neko_structs = {};

function neko_structObject( structName ){
    if( DEBUG ){
        expect( structName ).isString().size.gt(0);
        expect( structName ).not.isPropertyOf( neko_structs );
        
        // new way
        expect( structName, { 
            type:'string', 
            minLength:1, 
            notPropertyOf:neko_structs 
        });
    }
   
    // save cache 
    if( !neko_structs[structName] ) neko_structs[structName] = structName;
    
    return { 
        __struct__ : structName 
    };
}

function neko_isStruct( obj, struct ){
    
}

// some matchers
neko_expect_registerMatcher("isStruct", function( name ){return this.value.__struct__ === name;}, true );

/**
 * Grabs all namespace elements from the root node.
 * 
 * @param fN {function(): boolean} if it returns true, the element 
 *                                 will be added to the result set, else not (optional)
 */
function neko_grabElements( name, fN ){
   //TODO 
   var result = [];
   
   return result;
}

function neko_error_notImplementedYet(){
    var msg = "this function or algrithm is not implemented yet";
    log$error(msg);
    throw Error(msg);
}


/* 
 * @MODULE OBJECTS
 * @DESC 
 * @SINCE 31.01.12
 */

function objects_findPropertyKey( object, value ){
    
    // return key if you find the value in the object
    for( var key in object ) if( object[key ] === value ) return key;
    
    // return null, no key exists
    return null;
}

function objects_softCopy( source, target ){
    for( var key in source ){
        if( source.hasOwnProperty(key) ) target[key] = source[key];
    }
}


/* 
 * @MODULE COLLECTIONS
 * @DESC Functions to handle collections.
 * @SINCE 31.01.12
 */

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
    
    var matrix = ( list.__struct__ === 'Matrix' )? true: false;
    var i = 0, e = list.length;
    for(; i<e; i++ ){
        
        if( !matrix ) fN( list[i], i, list ); // fN( element, index, array )
        else{
            
            var subArray = list[i];
            var iSub = 0, eSub = subArray.length;
            for(;iSub<eSub;iSub++){
                
                fN( subArray[i], i, iSub, list );
            }
        }
    }
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
    
    a.__struct__ = 'Matrix';
    return a;
}

/**
 * Clears an array. Uses array.splice method to realize it.
 */
function collection_clear( array ){
    array.splice(0);
}


/* 
 * @MODULE EVENTS
 * @DESC 
 * @SINCE 31.01.12
 */

var event_data_ = {};

function event_dispatch( name ){
    if( DEBUG ) expect( name ).isString();
    
    var args = collection_slice( arguments, 1 );
   
    var array = event_data_[name];
    if( array ){
        for( var i=0, e= array.length; i<e; i++ ) array[i].fN.apply( null, args );
    }
}

/**
 * Registers a function in an event handler. If the event will be fired, all connected handlers (listeners) will be 
 * fired as well.
 */
function event_listen( name, fN ){
    if( DEBUG ){
        expect( name ).isString();
        expect( fN ).isFunction();
    }
    
    //TODO: support limited events like only 4 days or similar
    
    if( !event_data_[name] ) event_data_[name] = [];
    event_data_[name].push( {fN:fN} ); // later we add timers too
}


/* 
 * @MODULE EVENTS
 * @DESC Pipeline module for the neko framework that allows to use javascript functions (approved ones) over network
 *       for sharing data with view/controller clients.
 * @SINCE 31.01.12
 */

var pipe_data_ = {}

function pipe_getRegisterMap(){
    // register map object<key,number>
}

function pipe_register(key){
    if( typeof window[key] === 'undefined' ) throw Error(key+" does not exists in root namespace");
}

function pipe_push(){
    if( DEBUG ) expect(arguments).size.ge(1);
    
    var opCode = arguments[0];
    var args = collection_slice(arguments,1);
    
    // use opcode as key (temporary)
    //TODO: implement an adapter that maps opcode as numbers to the correct functions
    //      this would add also the possibility to prevent illegal usage of system functions
    var result = JSON.stringify( window[opCode].apply(null,args) );
    
    // send result back
}

function pipe_pushMsg( msg ){
    if( TYPED ) expect(msg).isString();
    
    var data = JSON.parse(msg);
    pipe_push(data.code, data.args);
}

Function.prototype.setClientCallable = function(){
    pipe_register("....TODO....");
}