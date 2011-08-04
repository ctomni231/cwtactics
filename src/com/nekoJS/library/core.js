(function(){

    if( typeof neko !== 'undefined' ){
        throw new Error("NekoJS property 'neko' seems to be used already!"+
            "Aborting...");
    }

    neko = {
        VERSION : 2.91, // loader must be completed,
                        // separate class system (maybe)
                        // organize helper functions

        VERSION_TAG : "KAMINARO"
    }

    function getRootContext(){
        return (function(){
            return this;
        })();
    }


    /*
     * module system
     */

    var mods = {};

    function defineMod( modName ){

        // check the module name
        if( !(modName instanceof String) ||
            modName.length === 0 ||
            typeof mods[modName] !== 'undefined' ){

            throw new Error("neko.define; modName has to be a valid string,"+
                            " that is not empty or already registered");
        }

        var factory = arguments[1];
        var args = [];
        // solve dependencies
        if( arguments.length === 3 ){

            // load dependencies

            // set arguments by dependencies

            // set correct factory
            factory = arguments[1];
        }

        var result = factory.apply( null, args );
        if( typeof result === 'object' ){

            // register API object
            mods[ modName ] = result;
        }
        else{
            throw new Error("neko.define; invalid returning API object");
        }
    }

    function requireMod( modName ){
        var res = mods[modName];

        if( typeof res !== 'undefined' ){ return res; }
        else{
            
            // if loader is on, load module

            // if loader is off
            throw new Error("neko.require; module "+modName+" does not exists");
        }
    }

    neko.define = defineMod;
    neko.require = requireMod;









    /**
     * Sets a value in a given namespace.
     *
     * @param {String} namespace exact path of the variable
     * @param value value set will be injected in the namespace
     */
    function setValueByPath( namespace , value ){

        if( typeof namespace !== 'string' ){
            throw "IllegalArgument";
        }

        var p = namespace.lastIndexOf(".");
        var attr = namespace.slice( p+1 );

        namespace = namespace.slice( 0 , p );

        this.getObjectValue( namespace )[attr] = value;
    }
    
    /**
     * Returns the value of a given namespace.
     *
     * @param {String} namespace exact path of the variable
     * @return the content of the variable
     */
    function getValueByPath( namespace ){

        if( typeof namespace !== 'string' ){
            throw "IllegalArgument";
        }

        namespace = namespace.split(".");
        var obj = meowEngine.rootCtx;

        for( var i = 0 ; i < namespace.length ; i++ )
        {
            obj = obj[ namespace[i] ];
        }

        return obj;
    }

    /**
     * Adds adapter functions in the object for all function of the shortcut
     * object.
     *
     * @function
     * @example
     * Adapter Shape:
     * function(){
     *    shortcutFunction.apply(target,arguments);
     * }
     */
    meowEngine.delegationFunction = function( obj, fName ){

        var fu = obj[fName];

        if( typeof fu !== 'function' ){
            throw "IllegalArgument";
        }

        return (function(){
            fu.apply(obj,arguments);
        })
    };

    /*
     * Class system
     * 
     * Fork of http://myjs.fr/my-class/ 04.06.2011
     * Current State: No changes
     */

    /**
     * Creates a new class with a given class implementation.
     */
    function Class(){
        var cls = softClass.apply( null , arguments );
        Object.freeze( cls );
    }

    /**
     * Creates a new class with a given class implementation.
     */
    function softClass(){

        var len = arguments.length;
        var body = arguments[len - 1];
        var SuperClass = len > 1 ? arguments[0] : null;
        var hasImplementClasses = len > 2;
        var Class, SuperClassEmpty;

        if (body.constructor === Object) {
            Class = function() {};
        } else {
            Class = body.constructor;
            delete body.constructor;
        }

        if (SuperClass) {
            SuperClassEmpty = function() {};
            SuperClassEmpty.prototype = SuperClass.prototype;
            Class.prototype = new SuperClassEmpty();
            Class.prototype.constructor = Class;
            Class.Super = SuperClass;
            extend(Class, SuperClass, false);
        }

        if (hasImplementClasses)
            // for (var i = 1; i < len - 1; i++)
            // meow parses from right outer subclass, going left, to the first
            // subclass
            for (var i = len-2; i > 0; i--)
                extend(Class.prototype, arguments[i].prototype, false);

        extendClass(Class, body);

        return Class;

    }

    function extendClass(Class, extension, override) {
        if (extension.STATIC) {
            extend(Class, extension.STATIC, override);
            delete extension.STATIC;
        }
        extend(Class.prototype, extension, override)
    }

    function extend(obj, extension, override) {
        var prop;
        if (override === false) {
            for (prop in extension)
                if (!(prop in obj))
                    obj[prop] = extension[prop];
        } else {
            for (prop in extension)
                obj[prop] = extension[prop];
            if (extension.toString !== Object.prototype.toString)
                obj.toString = extension.toString;
        }
    }
})();