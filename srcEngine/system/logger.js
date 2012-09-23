/** @private */
cwt._loggerArg = null;

/** @private */
cwt._formatReplacer = function( el, i ){
  var arg = cwt._loggerArg[ parseInt(i,10)+1];
  return ( typeof arg !== 'string' )? JSON.stringify( arg ) : arg;
};

/** @private */
cwt._stringFormat = function( str ){
  cwt._loggerArg = arguments;
  return str.replace(/\{(\d+)\}/g, cwt._formatReplacer );
};

/**
 * Normal information message.
 */
cwt.info = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.info( msg );
};

/**
 * Warning message.
 */
cwt.warn = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.warn( msg );
};

/**
 * Error/Critical message.
 */
cwt.error = function(){
  var msg = cwt._stringFormat.apply( cwt.log, arguments );
  console.log( msg );
  log.error( msg );
  throw Error( msg );
};