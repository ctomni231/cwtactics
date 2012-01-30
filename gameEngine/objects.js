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