/**
 * Serialization management.
 *
 * @namespace
 */
cwt.persist = {

  /** @private */
  _persMap: {},

  /**
   * Registers a property key in the persist controller.
   *
   * @param mKey module key
   * @param pKey property key
   */
  registerProperty: function( mKey, pKey ){

    // create property list if it not exists
    if( !this._persMap.hasOwnProperty(mKey) ){
      this._persMap[ mKey ] = [];
    }

    // check existence
    if( this._persMap[ mKey ].indexOf( pKey ) != -1 ){
      cwt.log.error("property {0} from module {1} is already registered", pKey, mKey );
    }
    else { this._persMap[ mKey ].push( pKey ); }
  },

  /**
   * Persists the actual game instance.
   */
  saveGame: function(){
    var result = {};

    var keys = Object.keys( this._persMap );
    for( var i = 0, e = keys.length; i<e; i++ ){
      var key = keys[i];
      var mod = cwt[ key ];

      result[ key ] = {};
      var sKeys = Object.keys( this._persMap[key] );
      for( var j = 0, ej = keys.length; j<ej; j++ ){

        result[ key ][ sKeys[i] ] = mod[ sKeys[i] ];
      }
    }

    // serialize
    var resultString = JSON.stringify( result );

    var keys = Object.keys( this._persMap );
    for( var i = 0, e = keys.length; i<e; i++ ){
      delete result[keys[i]];
    }
  },

  /**
   * Loads a game from a data block.
   *
   * @param data
   */
  loadGame: function( data ){

    if( typeof data === 'string' ){

      // convert to js object if necessary
      data = JSON.parse( data );
    }

    // load map from data
    cwt.model.loadMap( data );

//    var keys = Object.keys( this._persMap );
//    for( var i = 0, e = keys.length; i<e; i++ ){
//      var key = keys[i];
//      var mod = cwt[ key ];
//
//      var sKeys = Object.keys( this._persMap[key] );
//      for( var j = 0, ej = keys.length; j<ej; j++ ){
//
//        // get data from object and insert it into module
//        mod[ sKeys[i] ] = data[ key ][ sKeys[i] ];
//      }
//    }
  }
};