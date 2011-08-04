neko.define( "signals" , function(){

    var _signals = {}; // stores all connected global signals

    function dispatch( sigName ){

        var signalArray = _signals[ sigName ];
        if( typeof signalArray === 'undefined' ){
            // no listeners connected
            return;
        }

        // call event
        var args = Array.prototype.slice.call(arguments, 1);
        for( var i = 0, e = signalArray.length; i < e; i++ ){
            
            signalArray[i].apply( null, args );
        }
    }

    function onSignal( sigName, listener ){

        if( typeof sigName === 'undefined' || typeof listener !== 'function' ){
            throw new Error("signals.onSignal, IllegalArgument(s)");
        }

        // exists signal already? If not, create it
        if( typeof _signals[ sigName ] === 'undefined' ){
            _signals[ sigName ] = [];
        }

        _signals[ sigName ].push( listener );
    }
    
    function remove( sigName, listener ){

        if( typeof sigName === 'undefined' || typeof listener !== 'function' ){
            throw new Error("signals.onSignal, IllegalArgument(s)");
        }

        var array = _signals[ sigName ];
        var index = array.indexOf( listener );

        // if not exists, return false
        if( index == -1 ) return false;
        
        // else remove it and return true
        array.splice( index , 1);
        return true;
    }


    // module API
    return {

        /**
         * Disconnects a listener from a signal.
         *
         * @param {sigName} sigName signal name
         * @param {Function} listener listener function
         * @return {Boolean} true if removed, else if it is not
         *                   added to signal false
         */
        remove : remove,

        /**
         * Dispatches a signal and invokes all connected listeners.
         */
        dispatch : dispatch,

        /**
         * Connects a listener to a signal.
         *
         * @param {sigName} sigName signal name
         * @param {Function} listener listener function
         */
        onSignal : onSignal
    }
})