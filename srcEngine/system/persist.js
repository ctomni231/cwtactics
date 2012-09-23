/** @private */
cwt._persitenceMap = [];

/**
 * Registers a property key in the persist controller.
 *
 * @param mKey module key
 * @param pKey property key
 */
cwt.serializedProperty = function( pKey ){

  if( cwt._persitenceMap.indexOf( pKey) === -1 ){
    if( cwt[pKey] === undefined ){
      cwt.error( "property {0} is not defined", pKey );
    }
    else cwt._persitenceMap.push(pKey);
  }
  else{
    cwt.error( "property {0} is already registered", pKey );
  }
};

/**
 * Persists the actual game instance.
 */
cwt.serializeModel = function(){
  var result = {};
  var keys = cwt._persitenceMap;

  // add properties to the tempoary object
  for( var i = 0, e = keys.length; i<e; i++ ){
    result[ keys[i] ] = cwt[ keys[i] ];
  }

  // serialize
  var resultString = JSON.stringify( result );

  // drop properties from the tempoary object
  for( var i = 0, e = keys.length; i<e; i++ ){
    delete result[ keys[i] ];
  }

  return resultString;
};

/**
 * Loads a game from a data block.
 *
 * @param data
 */
cwt.deserializeModelData = function( data ){
  if( typeof data === 'string' ){
    // convert to js object if necessary
    data = JSON.parse( data );
  }

  // load map from data
  cwt.loadMap( data );
};