 (function(){

    // MEOW TESTING MODULE
	// ====================
	//
	// LICENSE: MEOW LICENSE (SEE LICENSE FILE)
	// SINCE: 10.07.2011
	//======================================================================

    /** @namespace */
    meowEngine.test = {};

    // ASSERTS
    //======================================================================

    /** @namespace */
    meowEngine.assert = {};

    /**
	 * @param expression expression, that returns a boolean value at the end
	 * @param {String} msg message that will be displayed, if error thrown
	 *	 (optional)
	 * @throws AssertionException if the expression is not true
	 */
    meowEngine.assert.isTrue = function( expr, msg ){

		if( expr != true ){
			throw meowEngine.createError("AssertionError",msg);
		}
	};

    /**
	 * @param expression expression, that returns a boolean value at the end
	 * @param {String} msg message that will be displayed, if error thrown
	 *	 (optional)
	 * @throws AssertionException if the expression is not false
	 */
	meowEngine.assert.isFalse = function( expr, msg ){

		assertTrue( !expr );
	};

    /**
	 * @param {Function} func function object that will be called and checked
	 * @param {String} msg message that will be displayed, if error thrown
	 *	 (optional)
	 * @throws AssertionException if the expression not fails
	 */
	meowEngine.assert.fails = function( func, msg ){

		if( !meowEngine.checks.isFunction( func ) ){
			throw meowEngine.createError("IllegalArgument",
                                            "func has to be a function");
		}

		try{

            func();
		}
		catch( e ){
			/* function thrown an error, assert is correct */
			return;
		}

		throw meowEngine.createError("AssertionError",msg);
	};


    // LOGGER
	//======================================================================

    /**
	 * Logger class, to log messages on the console.
	 *
	 * @class
	 */
	meowEngine.test.Logger = 
        meowEngine.Class( /** @lends meowEngine.test.Logger# */ {

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
			 * @memberOf meowEngine.test.Logger#
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
				consoleObj =
					( console )? console : ( (Console)? Console : null);
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
			 * @memberOf meowEngine.test.Logger#
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


    // TRACING SYSTEM
	//======================================================================

    var _traceLogger = new meowEngine.test.Logger("TRACER => ");

    /**
     * Places tracers around all functions of an object and it's sub objects,
     * if the recursiv mode is on.
     *
     * @param {Object} obj object, that will be traced
     * @param {Boolean} recursiv if true, all sub objects will be traced too
     *        (optional)
     */
    meowEngine.test.placeTracer = function( obj, recursiv ){

        if( typeof obj !== 'object' ){
            throw "placeTracer, obj has to be an object";
        }

        var i;
        var tp; // type of i in object
        var oF; // old function
        for( i in obj ){

            tp = typeof obj[i];
            if( tp === 'function' && i !== 'toString' ){

                oF = obj[i];
                obj[i] = _genTraceFunction( i, oF );
            }
            else if( recursiv === true && tp === 'object' ){
                _placeTr( obj, recursiv );
            }
        }
    }

    var _genTraceFunction = function( fName, func ){

        return function(){
            _traceLogger.info("Enter function "+fName+" of object ("+
                              this+") with arguments ["+
                              Array.prototype.slice.call(arguments)+"]");

            func.apply( this, arguments );

            _traceLogger.info("Leaving function "+fName+" of object ("+
                              this+")");
        };
    };

    // used as chache for place tracer itself
    var _placeTr = meowEngine.test.placeTracer;
    

    // TEST CASES
	//======================================================================

    var _tests = [];
	var _logger = new meowEngine.test.Logger("TEST => ");

	var _SET_UP = "setUp";
	var _TEAR_DOWN = "tearDown";

	var _startsWith = function( str, suffix ){
		return str.match("^"+suffix) == suffix;
	};

    /**
     * Defines a test case for the meowEngine testing evironment.
     *
     * @example
     * testCase({
     *
     *  setUp : function(){
     *   // code, that will be called first
     *  },
     *
     *  test_Name : function(){
     *   // a test function
     *  },
     *
     *  tearDown : function(){
     *   // code, that will be called last
     *  }
     * });
     *
     * @param {Object} testCase object that contains all tests
     */
    meowEngine.test.testCase = function( testCase ){
		_tests.push( testCase );
	}

    /**
     * Runs a test case.
     *
     * @param {Object} testCase test case object
     */
    meowEngine.test.runTestCase = function( testCase ){

		var tp;

		_logger.info("Start test case "+testCase._testCase);
		var time = (new Date).getTime();
		var num=0,numFailed=0;

		// setup test case
		if( typeof testCase[ _SET_UP ] === 'function' ){
			try{
				testCase[ _SET_UP ]( _logger );
				_logger.info("set up succeed");

				for( var f in testCase ){
					tp = typeof testCase[f];
					if( tp === 'function' ){

						if( _startsWith( f , "test_" ) ){
							try{
								testCase[ f ]( _logger );
								_logger.info( f+" succeed");
							}
							catch( e ){
								_logger.info( f+" failed, because of "+e);
								numFailed++;
							}
							finally{
								num++;
							}
						}
					}
				}

				// tear down test case
				if( typeof testCase[ _TEAR_DOWN ] === 'function' ){
					try{
						testCase[ _TEAR_DOWN ]( _logger );
						_logger.info("tear down succeed");
					}
					catch( e ){
						_logger.info("tear down failed, because of "+e);
					}
				}
			}
			catch( e ){
				_logger.info("set up failed, because of "+e);
			}
		}

		time = (new Date).getTime() - time;
		_logger.info("Test '"+testCase._testCase+"' done");
		_logger.info("Time needed: "+time+" ms");
		_logger.info("Number of tests: "+num+", failed: "+numFailed+" \n" );

		return ( numFailed == 0 );
	};

    /**
     * Runs all registered test cases.
     */
	meowEngine.test.runAll = function(){

		var i,e = _tests.length;
        var _runTest = meowEngine.test.runTestCase;
		for( i = 0 ; i < e ; i++ ){
			_runTest(_tests[i]);
		}
	};

    // shortcuts
    meowEngine.signals.onSignal( meowEngine.MEOW_SHORTCUTS , function(){

       $testCase = meowEngine.test.testCase;
       $runAllTests = meowEngine.test.runAll;
    });


})();