neko.define("nekoLog",function(){
    
    var systemLogger = NEKO_SYS_LOGGER;

    // neko uses a predefined logger to be more user friendly with different
    // javascript environments
    if( typeof systemLogger === 'undefined' ){
        throw new Error("nekolog needs a system logger fucntion placed in "+
                        "NEKO_SYS_LOGGER variable like console.log in mozilla "+
                        "firefox");
    }
    
    var Logger = neko.Class( /** @lends nekoLog.Logger# */{

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

        /**
         * @param {String} identifier will be printed before every log message
         * @param consoleObject console object, that has the log function
         */
        constructor : function( identifier, consoleObj )
        {
            this._identifier = ( typeof identifier === 'string' )?
                identifier : "";

            /**
             * Status of the logger, the status describes want level of debug
             * messages will be logged. If a message is on a lower level as the
             * set status of the debug logger, then the message won't be
             * displayed on the console.
             *
             * @memberOf nekoLog.Logger#
             * @field
             *
             * @example
             * Value can be one of the following constants:
             * meow.Logger.LEVEL_OFF
             * meow.Logger.LEVEL_INFO
             * meow.Logger.LEVEL_FINE
             * meow.Logger.LEVEL_WARN
             * meow.Logger.LEVEL_CRITICAL
             */
            this.status = this.LEVEL_INFO;

            // set default web console, if possible
            if( typeof consoleObj === 'undefined' ){
                consoleObj = systemLogger;
            }

            /**
             * Default output instance on is Console ( available in Firefox ).
             * If you want to define an own logger, place it as javaScript
             * compatible object in variable 'console' or set it with
             * the constructor of the logger.
             *
             * @example
             * Structure:
             *  void log( String message )
             *
             * @memberOf nekoLog.Logger#
             * @field
             * @private
             */
            this._logger = consoleObj;
        },

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

    return {

        VERSION : 1.0,
        
        Logger : Logger
    }
});