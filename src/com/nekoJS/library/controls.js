neko.define("input", function(){

    var _downKeys = {};
    var _actions = {};

    var _on = 1;
    var _off = 0;

    /**
     * Registeres a key down event in the meowEngine control system.
     *
     * @param {Number} keyID key identical number
     */
    function keyDown( keyID ){
        _downKeys[keyID] = _on;
    }

    /**
     * Registeres a key up event in the meowEngine control system.
     *
     * @param {Number} keyID key identical number
     */
    function keyUp( keyID ){
        // dont delete keys, because normally they
        // will be invoked later again
        _downKeys[keyID] = _off;
    }

    /**
     * Binds a key with an action.
     *
     * @param {Number} keyID key identical number
     * @param {String} action action name
     */
    function bindKey( keyID, action ){

        if( typeof action !== 'string' ){
            throw "Input, bindKey has an illegal argument";
        }

        if( !_actions[action] ){
            _actions = new Array();
        }
        else if( _actions[action].indexOf(keyID) != -1 ){
            return;
        }

        _actions[action].push(keyID);
    }

    /**
     * Unbinds a key from an action.
     *
     * @param {Number} keyID key identical number
     * @param {String} action action name
     */
    function unbindKey( keyID, action ){

        assert.isString(action);
        var array = _actions[action];

        if( !array ){
            throw "action is undefined or empty, both normally can't be!";
        }

        var i = array.indexOf(keyID);
        if( i != -1 ){
            array.splice( i , 1 );
        }

        // delte array if empty
        if( array.length == 0 ){
            delete _actions[action];
        }
        array = null;
    }

    /**
     * Checks the status of a key ID.
     *
     * @return true, if the key is down, else false
     */
    function isKeyDown( keyID ){

        return _downKeys[ keyID ] == _on;
    }

    /**
     * Chechks the status of the given action.
     *
     * @return true, if the action is active, else false
     */
    function isAction( action ){

        if( typeof action !== 'string' ){
            throw "Input, isActive has an illegal argument";
        }

        var array = _actions[action];

        if( !array ){
            throw "action is undefined or empty, both normally can't be!";
        }

        var i,e = array.length;
        for( i = 0; i < e ; i++ ){

            // if one is triggered, action is true
            if( _downKeys[ array[i] ] ){
                return true;
            }
        }

        return false;
    }

    // module API
    return{

        VERSION : 1.0,
        
        bindKey     : bindKey,
        unbindKey   : unbindKey,

        isAction    : isAction,
        isKeyDown   : isKeyDown,

        keyDown     : keyDown,
        keyUp       : keyUp
    }
});