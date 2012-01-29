function objects$findPropertyKey( object, value ){
    
    // return key if you find the value in the object
    for( var key in object ) if( object[key ] === value ) return key;
    
    // return null, no key exists
    return null;
}