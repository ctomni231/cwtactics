function neko_expectionError(msg){
    
    if( DEBUG ) log_error("ExpectionError; "+msg);
    
    throw Error("ExpectionError; "+msg);
}

/**
 * Expect class, that contains a value.
 */
function neko_expect_Expect( value ){
    this.value = value;
}

neko_expect_Expect.prototype.not = {};
neko_expect_Expect.prototype.size = {};

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

/**
 * Generates an expection object.
 */
function neko_expect( value ){
    return new neko_expect_Expect(value);
}
var expect = expect || neko_expect;


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
 * MATCHERS
 */

neko_expect_registerMatcher("isString", function(){
    return typeof this.value === 'string';
},true);

neko_expect_registerMatcher("isNumber", function(){
    return typeof this.value === 'number';
},true);

neko_expect_registerMatcher("isInteger", function(){
    var n = this.value;
    return typeof n === 'number' && n%1 === 0;
},true);

neko_expect_registerMatcher("isPropertyOf", function( obj ){
    return typeof obj[this.value] !== 'undefined';
},true);

neko_expect_registerMatcher("ge", function(n){
    return this.value >= n;
},true,true);

neko_expect_registerMatcher("gt", function(n){
    return this.value > n;
},true,true);

neko_expect_registerMatcher("lt", function(n){
    return this.value < n;
},true,true);

neko_expect_registerMatcher("le", function(n){
    return this.value <= n;
},true,true);

