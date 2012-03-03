var nekoLog = {

  /**
   *
   * @param {string} str format string
   * @param {...*} var_args
   */
  format: function( str){
    var args = arguments;
    str= str.replace(/\{(\d+)\}/g, function() {
      return args[parseInt(arguments[1])+1];
    });
    return str;
  },

  /**
   * @default Console.log(level+":: "+msg);
   * @config can be replaced by a custom logger
   */
  logFN: function(level,message){
    console.log(nekoLog.format("{0}: {1}",level,message));
  },

  /**
   * Logger levels.
   */
  Level:{
    INFO:'INFO',
    WARN:'WARN',
    ERROR:'ERROR'
  },

  /**
   * Prints an information message.
   */
  info: function(){
    nekoLog.logFN(nekoLog.Level.INFO, nekoLog.format.apply(null,arguments));
  },

  /**
   * Prints a warning message.
   */
  warn: function(){
    nekoLog.logFN(nekoLog.Level.WARN, nekoLog.format.apply(null,arguments));
  },

  /**
   * Prints an error message.
   */
  error: function(){
    nekoLog.logFN(nekoLog.Level.ERROR, nekoLog.format.apply(null,arguments));
  }
};

// export nekoLog, if it is called in a commonjs environment
if( typeof exports !== 'undefined' ) exports.nekoLog = nekoLog;