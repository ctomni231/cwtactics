neko.define( "assert", function(){

    function AssertionError( message, actual, expected ){
        this.message = message;
        this.actual = actual;
        this.expected = expected;
    }

    AssertionError.prototype = new Error();
    AssertionError.constructor = exports.AssertionError;

    function generateMessage( defaultMsg, optinalMsg ){

        return ( typeof optionalMsg !== 'undefined' )? optinalMsg : defaultMsg;
    }

    function isDeepEqual(value1, value2) {

        if (value1 === value2) {
            return true;
        } else if (value1 instanceof Date && value2 instanceof Date) {
            return value1.getTime() === value2.getTime();
        } else if (typeof(value1) != "object" || typeof(value2) != "object") {
            return value1 == value2;
        } else {
            return objectsAreEqual(value1, value2);
        }
    }

    function ok( guard, message_opt ){

        if (!!value === false) {
            throw new AssertionError(
            generateMessage(guard+" expected to be true, but is not",
            message_opt),
            guard,
            true);
        }
    }

    function equal( actual, expected, message_opt ){

        if ( actual != expected ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be "+expected , message_opt),
            actual,
            expected);
        }
    }

    function notEqual( actual, expected, message_opt ){

        if ( actual == expected ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be different than "+expected
            , message_opt),
            actual,
            expected);
        }
    }

    function deepEqual( actual, expected, message_opt ){

        if ( isDeepEqual(actual,expected) === false ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be "+expected , message_opt),
            actual,
            expected);
        }
    }

    function notDeepEqual( actual, expected, message_opt ){

        if ( isDeepEqual(actual,expected) === true ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be different than "+expected
            , message_opt),
            actual,
            expected);
        }
    }

    function strictEqual( actual, expected, message_opt ){

        if ( actual !== expected ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be "+expected , message_opt),
            actual,
            expected);
        }
    }

    function notStrictEqual( actual, expected, message_opt ){

        if ( actual === expected ) {
            throw new AssertionError(
            generateMessage( actual+" expected to be different than "+expected
            , message_opt),
            actual,
            expected);
        }
    }

    function fails( block, Error_opt, message_opt ){

        if( block instanceof Function ){

            try{

                block();

                // if not func not throws anything until here, assertion error
                throw new AssertionError(
                generateMessage( "assert.throws does not thorwn any error",
                message_opt),
                'undefined',
                ( typeof Error_opt !== 'undefined' )? Error_opt: Error );
            }
            catch(e){

                if( typeof Error_opt !== 'undefined' ){
                    if( e !== Error_opt ){

                        throw new AssertionError(
                        generateMessage( e+" was thrown, but "+Error_opt+
                            " was expected", message_opt),
                        e,
                        Error_opt );
                    }
                }
            }
        }
        else{
            throw new Error("First argument of assert.throws has to be a " +
                "function!");
        }
    }

    return {

        VERSION         : 1.0,

        AssertionError : AssertionError,

        // commonJS assertions
        ok : ok,
        equal : equal,

        deepEqual : deepEqual,
        notDeepEqual : notDeepEqual,

        strictEqual : strictEqual,
        notStrictEqual : notStrictEqual,

        fails : fails   // implements assert.throws from commonJS
    };
});