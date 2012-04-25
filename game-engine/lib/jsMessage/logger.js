/**
 * Simple logger filter that logs incoming messages. Useful for debugging information during the development phase.
 *
 * @since 19.04.2012
 * @author BlackCat (blackcat.myako@gmail.com)
 */
jsMessage.filter.simpleLogger = function( header, logger ){

  // search header
  var header = ( header ) || '(jsMessage Logger)';
  var logFn;

  // custom logger ?
  if( typeof logger === 'function' ){
    logFn = logger;
  }
  else logFn = function( args ){
    console.log( header+" got filter context call with arguments: "+JSON.stringify(args) );
  };

  // return filter object
  return {
    filter: logFn
  };
};