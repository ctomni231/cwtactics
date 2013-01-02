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