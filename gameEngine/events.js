/**
 * Simple event module for the neko framework.
 */

if( DEBUG ){
    namespaceNotExists("event");
    namespaceExists("collection");
}

var event__data = {};

function event_dispatch( name ){
    if( TYPED ) expect( name ).isString();
    
    var _args = collection_slice( arguments, 1 );
    
    var _array= event__data[name];
    if( _array ){
        for( var i=0, e=_array.length; i<e; i++ ) _array[i].fN.apply( null, _args );
    }
}

function event_listen( name, fN ){
    if( TYPED ){
        expect( name ).isString();
        expect( fN ).isFunction();
    }
    
    //TODO: support limited events like only 4 days or similar
    
    if( !event__data[name] ) event__data[name] = [];
    event__data[name].push( {fN:fN} ); // later we add timers too
}