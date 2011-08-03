neko.define("checks",function(){

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is a number, else false
     */
    function isNumber( arg ){
        return typeof arg === 'number';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is a string, else false
     */
    function isString( arg ){
        return typeof arg === 'string';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is a function, else false
     */
    function isFunction( arg ){
        return typeof arg === 'function';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is undefined, else false
     */
    function isUndefined( arg ){
        return typeof arg === 'undefined';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is an object, else false
     */
    function isObject( arg ){
        return typeof arg === 'object';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is an array, else false
     */
    function isArray( arg ){
        return typeof arg === 'object' && typeof arg.length === 'number';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is a boolean, else false
     */
    function isBoolean( arg ){
        return typeof arg === 'boolean';
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is empty, else false
     */
    function isEmpty( arg ){
        return arg.length === 0;
    }

    /**
     * @function
     * @param arg argument, that will be checked
     * @return true, if the argument is not empty, else false
     */
    function notEmpty( arg ){
        return arg.length !== 0;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are numbers, else false
     */
    function areNumbers(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'number' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are strings, else false
     */
    function areStrings(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'string' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are functions, else false
     */
    function areFunctions(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'function' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are undefined, else false
     */
    function areUndefined(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'undefined' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are objects, else false
     */
    function areObjects(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'object' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are arrays, else false
     */
    function areArrays(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'object' ||
                typeof arguments[i].length !== 'number' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are booleans, else false
     */
    function areBooleans(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'boolean' ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments are empty, else false
     */
    function areEmpty(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( arguments[i].length !== 0 ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @return true, if all arguments aren't empty, else false
     */
    function arentEmpty(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( arguments[i].length === 0 ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @param {Object} obj object where the arguments will searched
     * @return true, if all arguments are in the object, else false
     */
    function inObject(){

        var len = arguments.length;
        var obj = arguments[ len-1 ];
        var i,tmp;

        if( !isObject(obj) ){
            throw "inObject: last parameter must be an object";
        }

        // use a direct check, if only one argument to check
        if( len == 2 ){

            tmp = arguments[0];

            for( i in obj ){
                if( obj[i] === tmp )
                    return true;
            }

            return false;
        }
        // if many arguments present, use a cached check
        else{

            var objList = new Array();
            for( i in obj ){
                objList.push( obj[i] );
            }

            var e2 = len-1;
            for( i = 0; i<e2; i++){
                if( objList.indexOf( arguments[i] ) == -1 ) return false;
            }

            return true;
        }
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @param {Array} array array where the arguments will searched
     * @return true, if all arguments are in the list, else false
     */
    function inList(){

        var len = arguments.length;
        var list = arguments[ len-1 ];

        if( !isArray(list) ){
            throw "inList: last parameter must be a list";
        }

        // check all given arguments
        for( var i = 0; i < len-1; i++ ){
            if( list.indexOf( arguments[i] ) == -1 ) return false;
        }

        return true;
    }

    /**
     * @function
     * @param {Object} obj object that will be checked
     * @param {String} property property that will be searched
     * @param {String} type of the property (optional)
     * @return true, if the property exists in the object, else false
     */
    function hasAttribute( obj, property, type ){

        if( isObject(obj) ){
            return ( typeof type === 'string' )?
            typeof obj[property] !== type :
            typeof obj[property] !== 'undefined';
        }
        else return false;
    }

    /**
     * @function
     * @param {Varrags...} args objects, that will be checked
     * @param {Class} cls class object
     * @return true, if all arguments are instances of the class, else false
     */
    function areInstancesOf(){

        var i;
        var e = arguments.length;
        var cls = arguments[e-1];

        for( i = 0; i < e-1; i++ ){
            if( !( arguments[i] instanceof cls ) ) return false;
        }

        return true;
    }

    // module API
    return {

        VERSION         : 1.0,

        inObject        : inObject,
        inList          : inList,
        hasAttribute    : hasAttribute,

        // single arguments
        isArrays        : isArrays,
        isBooleans      : isBooleans,
        isEmpty         : isEmpty,
        isFunctions     : isFunctions,
        isInstancesOf   : isInstancesOf,
        isNumbers       : isNumbers,
        isObjects       : isObjects,
        isStrings       : isStrings,
        isUndefined     : isUndefined,
        notEmpty        : notEmpty,

        // multiple arguments
        areArrays       : areArrays,
        areBooleans     : areBooleans,
        areEmpty        : areEmpty,
        areFunctions    : areFunctions,
        areInstancesOf  : areInstancesOf,
        areNumbers      : areNumbers,
        areObjects      : areObjects,
        areStrings      : areStrings,
        areUndefined    : areUndefined,
        arentEmpty      : arentEmpty
    }
});