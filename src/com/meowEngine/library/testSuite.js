neko.define("testCase",["nekoLog"],function( nekoLog ){

    var _tests = [];
    var _logger = new nekoLog.Logger("TEST SUITE => ");

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
    function testCase( testCase ){

        if( typeof testCase._testCase === 'undefined' ){
            throw new Error("_testCase variable has to be defined with a"+
                            " string");
        }

        _tests.push( testCase );
    }

    /**
     * Runs a test case.
     *
     * @param {Object} testCase test case object
     */
    function runTestCase( testCase ){

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
    }

    /**
     * Runs all registered test cases.
     */
    function runAllTests(){

        var i,e = _tests.length;
        var _runTest = runTestCase;
        for( i = 0 ; i < e ; i++ ){
            _runTest(_tests[i]);
        }
    }

    return {

        VERSION : 0.8,
        
        testCase    : testCase,

        runTestCase : runTestCase,
        runAllTests : runAllTests
    }
});