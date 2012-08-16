/**
 * Logging module.
 *
 * @example
 * For rhino users:
 * This implementation is not thread safe, every thread needs an own instance of this module.
 * If you really need logging in both threads, then make sure to create an instance of this logging
 * module in every thread. The expression cwt.log must be evaluated into a thread specific scope on
 * in every thread that uses this.
 *
 * @namespace
 */
cwt.log = {

  /** @private */
  _arg: null,

  /** @private */
  _repl: function( el, i ){
    var arg = cwt.log._arg[ parseInt(i,10)+1];
    return ( typeof arg !== 'string' )? JSON.stringify( arg ) : arg;
  },

  /** @private */
  _format: function( str ){
    this._arg = arguments;
    return str.replace(/\{(\d+)\}/g, this._repl );
  },

  /**
   * Normal information message.
   */
  info: function(){
    var msg = cwt.log._format.apply( cwt.log, arguments );
    console.log( msg );
    toastr.info( msg );
  },

  /**
   * Warning message.
   */
  warn: function(){
    var msg = cwt.log._format.apply( cwt.log, arguments );
    console.log( msg );
    toastr.warning(  msg );
  },

  /**
   * Error/Critical message.
   */
  error: function(){
    var msg = cwt.log._format.apply( cwt.log, arguments );

    console.log( msg );
    toastr.error( msg );
  }
};