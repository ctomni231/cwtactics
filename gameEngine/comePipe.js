/**
 * Pipeline module for the neko framework that allows to use javascript functions (approved ones) over network
 * for sharing data with view/controller clients.
 *
 */

var pipe$_data = {}

function pipe$getRegisterMap(){
    // register map object<key,number>
}

function pipe$register(key){
    if( typeof window[key] === 'undefined' ) throw Error(key+" does not exists in root namespace");
}

function pipe$push(){
    if( DEBUG ) expect(arguments).size.ge(1);
    
    var opCode = arguments[0];
    var args = collection$slice(arguments,1);
    
    // use opcode as key (temporary)
    //TODO: implement an adapter that maps opcode as numbers to the correct functions
    //      this would add also the possibility to prevent illegal usage of system functions
    var result = JSON.stringify( window[opCode].apply(null,args) );
    
    // send result back
}

function pipe$pushMsg( msg ){
    if( TYPED ) expect(msg).isString();
    
    var data = JSON.parse(msg);
    pipe$push(data.code, data.args);
}

Function.prototype.setClientCallable = function(){
    pipe$register("....TODO....");
}