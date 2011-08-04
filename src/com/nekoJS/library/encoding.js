neko.define("encoding", function(){

    var _encoders = {};

    /**
     * Encodes a string with a given algorithm.
     *
     * @param {String} str string, that will be encoded
     * @param {String} algorithm encoding algorithm, that will be used ( must be
     *          registered in the MeowEngine
     * @return {String} encoded string
     * @function
     */
    function encode( str, algorithm ){

        if( typeof name !== 'string' ||
            typeof _encoders[algorithm] === 'undefinded' ){

            throw "MeowEngine pushEncoder, illegal argument(s)";
        }

        return _encoders[algorithm](str);
    }

    /**
     * Registers an algorithm in the MeowEngine.
     *
     * @param {String} algorithm algorithm name
     * @param {Function} encoder algorithm function, that encodes the first
     *          argument
     */
    function pushEncoder( name, registerFunc ){

        if( typeof name !== 'string' || typeof registerFunc !== 'function' ){
            throw "MeowEngine pushEncoder, illegal argument(s)";
        }

        // test encoders
        var res = registerFunc("Hello");
        if( typeof res === 'string' || typeof res === 'number' ){
            _encoders[name] = registerFunc;
        }
        else{
            throw "pushEncoder, "+
            "encoder function seems not to be a valid encoder function";
        }
    }

    /**
     * Checks the status of an algorithm.
     *
     * @param {String} name algorithm algorithm name
     * @return true, if algorithm exists, else false
     * @function
     */
    function hasEncoder( name ){

        if( typeof name !== 'string' ){
            throw "MeowEngine pushEncoder, illegal argument";
        }

        return typeof _encoders[ name ] !== 'undefined';
    }

    /**
     * Returns a list of available controllers.
     */
    function listOfEncoders(){

        var a = [];
        var i = 0;
        for( var el in _encoders ){
            
            if( _encoders.hasOwnProperty(el) ){
                a[i] = el;
                i++;
            }
        }
    }

    // module API
    return{

        VERSION : 1.0,

        pushEncoder     : pushEncoder,
        encode          : encode,

        supports        : hasEncoder,
        listOfEncodings : listOfEncoders
    }
});