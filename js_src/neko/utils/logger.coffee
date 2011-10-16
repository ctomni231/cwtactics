neko.module "neko.utils.logger", ( require, exports ) ->
  ###
    Name: 
    Neko logger module
  
    Description:
    This is a very simple, but usable, implementation of a logger system. It
    allows to use a global logger from all neko modules or creating own custom
    loggers.
           
    License: 
    This module is released under the modified MIT license of neko
  
    Todo:
      - autodetect system loggers
  ###
  
  exports.VERSION = 
    major:1, 
    minor:0, 
    build:0
  
  # temporal function
  logLevelPrintF = ( level ) ->
    return ( msg ) ->
      if @status <= level 
        @_logger "#{@identifier} => #{msg.toString()}"
  
  # temporal function
  logLevelPrintF_Mod = ( level ) ->
    logger = NEKO_SYS_LOGGER # uses directly the system logger
    return ( msg ) ->
      if _status <= level 
        logger "NEKO_LOG => #{msg.toString()}" 
  
  
  exports.Logger = class Logger
    ###
    Logger class, that allows custom identifier and log levels.
    This implementation is build as back end for the available system logger,
    like console.log, that will be linked into the NEKO_SYS_LOGGER function.
    ###
    
    @LEVEL_INFO     : 0
    @LEVEL_FINE     : 1
    @LEVEL_WARN     : 2
    @LEVEL_CRITICAL : 3
    @LEVEL_OFF      : 4
    
    constructor:  ( @identifier, @consoleObj ) ->
      @identifier = "NEKO_LOG" unless @identifier?
      @status = Logger.LEVEL_INFO
      @_logger = NEKO_SYS_LOGGER unless @consoleObj?
      
    log:      logLevelPrintF Logger.LEVEL_INFO
    info:     logLevelPrintF Logger.LEVEL_INFO
    fine:     logLevelPrintF Logger.LEVEL_FINE
    warn:     logLevelPrintF Logger.LEVEL_WARN
    critical: logLevelPrintF Logger.LEVEL_CRITICAL

   
  # Initialises a default logger in the module scope.
  # Makes simple usage of a logger available with:
  #   var log = require("nekoJS.logger").log
  #   log("NekoJS logger is simple :D")

  _status = Logger.LEVEL_WARN # default level is warn
  
  exports.status   = ( status ) -> 
    if Logger.LEVEL_INFO <= status <= Logger.LEVEL_OFF
      _status = status
    else throw new Error "IllegalStatusNumber"
    
  exports.log      = logLevelPrintF_Mod Logger.LEVEL_INFO
  exports.info     = logLevelPrintF_Mod Logger.LEVEL_INFO
  exports.fine     = logLevelPrintF_Mod Logger.LEVEL_FINE
  exports.warn     = logLevelPrintF_Mod Logger.LEVEL_WARN
  exports.critical = logLevelPrintF_Mod Logger.LEVEL_CRITICAL