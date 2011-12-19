define(["lib/log4javascript"],function(){
	
	var _logger = log4javascript.getLogger("CustomWars Logger");
	var _popup = new log4javascript.PopUpAppender();
	_logger.addAppender( _popup );

	//TODO add property parameters to control logger appenders
	//TODO add property parameters to control logger level
	
	_logger.setLevel( log4javascript.Level.ALL ); // temporary
	
	var _level = _logger.getEffectiveLevel();
	
	
	/**
	 * PUBLIC LOGGER API 
	 */
	
	return{
		
		trace: function(){
			_logger.log( log4javascript.Level.TRACE, arguments );
		},
		
		debug: function(){
			_logger.log( log4javascript.Level.DEBUG, arguments );
		},
		
		info: function(){
			_logger.log( log4javascript.Level.INFO, arguments );
		},
		
		warn: function(){
			_logger.log( log4javascript.Level.WARN, arguments );
		},
		
		error: function(){
			_logger.log( log4javascript.Level.ERROR, arguments );
		},
		
		fatal: function(){
			_logger.log( log4javascript.Level.FATAL, arguments );
		},
		
		isTraceEnabled: function(){
			return _level.level <= log4javascript.Level.TRACE.level;
		},
		
		isDebugEnabled: function(){
			return _level.level <= log4javascript.Level.DEBUG.level;
		},
		
		isInfoEnabled: function(){
			return _level.level <= log4javascript.Level.INFO.level;
		},
		
		isWarnEnabled: function(){
			return _level.level <= log4javascript.Level.WARN.level;
		},
		
		isErrorEnabled: function(){
			return _level.level <= log4javascript.Level.ERROR.level;
		},
		
		isFatalEnabled: function(){
			return _level.level <= log4javascript.Level.FATAL.level;
		}
	};
});