cwt.defineLayer( CWT_LAYER_UTILITY, function( util ){

  /**
   * Fills an array with a value. Works also for matrix objects.
   *
   * @param arr
   * @param defaultValue
   */
  util.fill = function( arr, defaultValue ){
    var isFN = typeof defaultValue === 'function';

    if( arr.__matrixArray__ === true ){

      // COMPLEX ARRAY (MATRIX) OBJECT
      for(var i = 0, e = arr.length; i < e; i++){
        for(var j = 0, ej = arr.length; j < ej; j++){
          if( isFN ) arr[i][j] = defaultValue( i,j );
          else       arr[i][j] = defaultValue;
        }
      }
    }
    else{

      // SIMPLE ARRAY OBJECT
      for(var i = 0, e = arr.length; i < e; i++){
        if( isFN ) arr[i] = defaultValue( i );
        else       arr[i] = defaultValue;
      }
    }
  };

  /**
   * Creates a list and fills it with default values.
   *
   * @param len
   * @param defaultValue
   */
  util.list = function( len, defaultValue ){
    if( defaultValue === undefined ){ defaultValue = null; }

    var isFN = typeof defaultValue === 'function';
    var warr = [];
    for (var i = 0; i < len; i++) {
      if( isFN ) warr[i] = defaultValue( i );
      else       warr[i] = defaultValue;
    }

    return warr;
  };

  /**
   * Creates a matrix (table) and fills it with default values.
   *
   * @param w
   * @param h
   * @param defaultValue
   */
  util.matrix = function( w, h, defaultValue ){

    if( defaultValue === undefined ){ defaultValue = null; }

    var isFN = typeof defaultValue === 'function';
    var warr = [];
    for (var i = 0; i < w; i++) {

      warr[i] = [];
      for (var j = 0; j < h; j++) {

        if( isFN ) warr[i][j] = defaultValue( i,j );
        else       warr[i][j] = defaultValue;
      }
    }

    // meta data
    warr.__matrixArray__ = true;

    return warr;
  };

  /**
   * @config
   */
  util.DEBUG = false;

  /**
   * Overwritable logging function.
   *
   * @param string
   * @config
   */
  util.logInfo = function( string ){
    if( arguments.length > 1 ){
      string = Array.prototype.join.call( arguments, " " );
    }

    console.log( string );
  };

  /**
   * Overwritable logging function.
   *
   * @param string
   * @config
   */
  util.logWarn = function( string ){
    if( arguments.length > 1 ){
      string = Array.prototype.join.call( arguments, " " );
    }

    console.log( string );
  };

  /**
   * Overwritable logging function.
   *
   * @param string
   * @config
   */
  util.logError = function( error ){
    if( arguments.length > 1 ){
      error = Array.prototype.join.call( arguments, " " );
    }

    console.log( error );
    if( error instanceof Error ) console.log( error.stack );
  };

  util.objectToJSON = function( o ){
    return JSON.stringify(o);
  }
});