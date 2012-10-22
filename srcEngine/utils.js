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

/** @config */
util.DEBUG = false;

/** @constant */
util.LOG_INFO = 0;

/** @constant */
util.LOG_WARN = 1;

/** @constant */
util.LOG_ERROR = 2;

/** @config */
util.logWriter = function( level, string ){
  switch( level ){

    case util.LOG_ERROR:
      console.error( string );
      break;

    case util.LOG_INFO:
      console.log( string );
      break;

    case util.LOG_WARN:
      console.warn( string );
      break;

    default:  console.log( string );
  }
};

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

  util.logWriter( util.LOG_INFO , string );
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

  util.logWriter( util.LOG_WARN , string );
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

  util.logWriter( util.LOG_ERROR, error );
};

/**
 * Serializes a javascript object to a JSON specification compatible string.
 *
 * @param o
 */
util.objectToJSON = function( o ){
  return JSON.stringify(o);
};