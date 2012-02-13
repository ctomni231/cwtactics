var cwtLog = {
  
  /**
   * @default Console.log(level+":: "+msg);
   * @config can be replaced by a custom logger
   */
  logFN: function(level,message){ 
    Console.log(level+":: "+message); 
  },
  
  /**
   * Logger levels.
   */
  Level:{
    INFO:0,
    WARN:1,
    ERROR:2
  },
  
  /**
   * Prints an information message.
   */
  info: function(msg){
    cwtLog.logFN(cwtLog.Level.INFO,msg);
  },
  
  /**
   * Prints a warning message.
   */
  warn: function(msg){
    cwtLog.logFN(cwtLog.Level.WARN,msg);
  },
  
  /**
   * Prints an error message.
   */
  error: function(msg){
    cwtLog.logFN(cwtLog.Level.ERROR,msg);
  }
}