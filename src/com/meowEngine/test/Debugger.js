(function(){

	/**
	 * Debugger class, to log messages on the console.
	 *
	 * @class
	 * @since 29.05.2011
	 */
	meow.Debugger = debug;
	var debug = meow.Class( /** @lends meow.Debugger# */ {

		/** @constant */
		LEVEL_OFF : -1,

		/** @constant */
		LEVEL_INFO : 0,

		/** @constant */
		LEVEL_FINE : 1,

		/** @constant */
		LEVEL_WARN : 2,

		/** @constant */
		LEVEL_CRITICAL : 3,

		/** @private */
		_identifier : null,

		constructor : function( identifier )
		{
			this._identifier =
				( typeof identifier === 'string' )?	identifier : "";
		},

		/**
		 * Status of the logger, the status describes want level of debug
		 * messages will be logged. If a message is on a lower level as the set
		 * status of the debug logger, then the message won't be displayed on
		 * the console.
		 *
		 * Value can be one of the following constants:
		 *
		 * @example
		 * meow.debug.LEVEL_OFF
		 * meow.debug.LEVEL_INFO
		 * meow.debug.LEVEL_FINE
		 * meow.debug.LEVEL_WARN
		 * meow.debug.LEVEL_CRITICAL
		 */
		status : this.LEVEL_INFO,

		/**
		 * Default logger on is Console ( available in Firefox ). If you want
		 * to define an own logger, place it as javaScript compatible object
		 * in Console.
		 *
		 * @example
		 * Structure:
		 *  void log( String message )
		 *
		 * @private
		 */
		_logger : ( meow.out )? meow.out : null,

		/**
		 * Logs an information at LEVEL_INFO on the console.
		 *
		 * @param {String} msg message
		 */
		info : function( msg )
		{
			if( this.status >= this.LEVEL_INFO )
				this._logger.log( this._identifier+" INFO: "+msg );
		},

		/**
		 * Logs an information at LEVEL_FINE on the console.
		 *
		 * @param {String} msg message
		 */
		fine : function( msg )
		{
			if( this.status >= this.LEVEL_FINE )
				this._logger.log( this._identifier+" FINE: "+msg );
		},

		/**
		 * Logs an information at LEVEL_WARN on the console.
		 *
		 * @param {String} msg message
		 */
		warn : function( msg )
		{
			if( this.status >= this.LEVEL_WARN )
				this._logger.log( this._identifier+" WARN: "+msg );
		},

		/**
		 * Logs an information at LEVEL_CRITICAL on the console.
		 *
		 * @param {String} msg message
		 */
		critical : function( msg )
		{
			if( this.status >= this.LEVEL_CRITICAL )
				this._logger.log( this._identifier+" CRITICAL: "+msg );
		}
	});
	
})();