function neko$expectionError(msg){
    
    if( DEBUG ) log$error("ExpectionError; "+msg);
    
    throw Error("ExpectionError; "+msg);
}

/**
 * Expect class, that contains a value.
 */
function neko$expect$Expect( value ){
    this.value = value;
}

neko$expect$Expect.prototype.not = {};
neko$expect$Expect.prototype.size = {};

function neko$expect$registerMatcher( name, fN, notAble, sizeAble ){
    
    neko$expect$Expect.prototype[name] = function(){
        if( fN.apply(this, arguments) === false ) 
            neko$expectionError("matcher "+name+" failed on value "+this.value);
        
        return this;
    }
    
    // not statement
    if( notAble === true ){
        neko$expect$Expect.prototype.not[name] = function(){
            if( fN.apply(this, arguments) === true ) 
                neko$expectionError("matcher "+name+" failed on value "+this.value);
            
            return this;
        }
    }
    
    // size statement
    if( sizeAble === true ){
        neko$expect$Expect.prototype.size[name] = function(){
            
            var tmp = this.value; // remember old
            this.value = this.value.length;
            
            if( fN.apply(this, arguments) === false ) 
                neko$expectionError("matcher "+name+" failed on value "+this.value);
            
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
function neko$grabElements( name, fN ){
   //TODO 
   var result = [];
   
   return result;
}

/**
 * Generates an expection object.
 */
function neko$expect( value ){
    return new neko$expect$Expect(value);
}
var expect = expect || neko$expect;


if( DEBUG ) expect("log").not.isExistingNamespace() 

/**
 * Logs an normal message.
 */
function log$info( msg ){ 
    console.log( (new Date())+" INFO:: "+msg); 
}

/**
 * Logs a waring message.
 */
function log$warn( msg ){ 
    console.log( (new Date())+" WARN:: "+msg); 
}

/**
 * Logs an error message.
 */
function log$error( msg ){ 
    console.log( (new Date())+" ERROR:: "+msg); 
}




/*
 * MATCHERS
 */

neko$expect$registerMatcher("isString", function(){
    return typeof this.value === 'string';
},true);

neko$expect$registerMatcher("isNumber", function(){
    return typeof this.value === 'number';
},true);

neko$expect$registerMatcher("isInteger", function(){
    var n = this.value;
    return typeof n === 'number' && n%1 === 0;
},true);

neko$expect$registerMatcher("isPropertyOf", function( obj ){
    return typeof obj[this.value] !== 'undefined';
},true);

neko$expect$registerMatcher("ge", function(n){
    return this.value >= n;
},true,true);

neko$expect$registerMatcher("gt", function(n){
    return this.value > n;
},true,true);

neko$expect$registerMatcher("lt", function(n){
    return this.value < n;
},true,true);

neko$expect$registerMatcher("le", function(n){
    return this.value <= n;
},true,true);

