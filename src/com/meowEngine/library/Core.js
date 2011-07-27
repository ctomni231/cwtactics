(function(){

    // MEOW CORE MODULE
	// ================
	// 
	// LICENSE: MEOW LICENSE (SEE LICENSE FILE)
	// SINCE: 10.07.2011
	//======================================================================

    var _ud = 'undefined';

    // check meow namespace
    if( typeof meowEngine !== _ud ){
        throw "Meow Engine property 'meowEngine' seems to be used already!"+
              "Aborting...";
    }

    var MEOW_VERSION = 2.991;

    
    

    // CORE STUFF
    //======================================================================

    /** @namespace */
    meowEngine = {
        MEOW_SHORTCUTS : "MeowRegisterShortcuts"
    };

    /**
	 * Meow Engine core module, contains many functions and patterns, that
	 * will be used by it's sub modules.
     *
	 */
    meowEngine.MEOW_VERSION = MEOW_VERSION;

    /**
	 * This variable is often represented by the variable 'window' in
	 * different web browser environments. Independent from the used
	 * javaScript environment, this variable will always has the root
	 * context.
	 *
	 * @field
	 * @constant
	 *
	 * @example
	 * Idea from:
	 * http://www.nczonline.net/blog/2008/04/20/get-the-javascript-global/
	 */
	meowEngine.rootCtx = (function(){return this;})();

    /**
	 * Sets a value in a given namespace.
	 *
	 * @param {String} namespace exact path of the variable
	 * @param value value set will be injected in the namespace
	 */
    meowEngine.setValueByPath = function( namespace , value ){

        if( typeof namespace !== 'string' ){
            throw "IllegalArgument";
        }

        var p = namespace.lastIndexOf(".");
        var attr = namespace.slice( p+1 );

        namespace = namespace.slice( 0 , p );

        this.getObjectValue( namespace )[attr] = value;
    };
    
    /**
	 * Returns the value of a given namespace.
	 *
	 * @param {String} namespace exact path of the variable
	 * @return the content of the variable
	 */
    meowEngine.getValueByPath = function( namespace ){

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
    };

    /**
	 * Returns a sub array from an arguments array.
	 *
	 * @function
	 * @param {Array} array array instance
	 * @param {Number} from first position for the sub array
	 * @param {Number} to last position for the sub array ( exclusive )
	 * @return new array instance, that contains all entries from the from
	 *		   positon, to the to positon ( exclusive )
	 */
    meowEngine.sliceArrayFromArgs = function( array, from, to ){

        if( typeof array.length !== 'length' ||
            from < 0 ||
            from >= array.length ||
            to <= from ){

            var hA = new Array( to-from );
            for( var i = from; i < to; i++ ){
                hA.push( array[i] );
            }
        }
        else{
            throw "subArray, illegal argument(s)";
        }
    };

    /**
	 * Adds adapter functions in the object for all function of the shortcut
	 * object.
	 *
     * @function
	 * @example
	 * Adapter Shape:
	 * function(){
	 *	shortcutFunction.apply(target,arguments);
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

    /**
     *
     */
    meowEngine.parseNumber = function( expr, def, from, to ){
        
       var i = parseFloat( expr, 10 );
       if( typeof i === 'number'    &&
           typeof from === 'number' &&
           typeof to === 'number' ){

           // check range
           _isTrue( from <= to , "MeowEngine parseNumber,"+
                                 " illegal from to range");

           if( i < from || i > to  ){
               i = NaN;
           }
       }

       if( isNaN(i) && typeof def === 'number' ){
            i = def;
       }

       return i;
    }

    /**
	 * An empty function, that can be used to set place holders or similar.
	 */
    meowEngine.EMPTY_FUNCTION = function(){};

    /**
	 * An function that can be used to mark not implemented code segments in
	 * your code. If this function will called, it throws an error that says
	 * that the segment is not implemented yet.
	 */
    meowEngine.NOT_IMPLEMENTED_YET = function(){
        throw "This statement is not implemented yet!";
    };
    

    // CLASS SYSTEM
    //======================================================================


    /**
	 * Creates a new class with a given class implementation
	 *
	 * @param {Object...} extendClass class(es) that will be extended. Is a
	 *							   variable argument, so you can set as many
	 *							   classes you want. The first class you def.,
	 *							   will be the super class, the other child
	 *							   classes of a deeper level. You only can
	 *							   access the first class with the Super
	 *							   attribute. Parsing algorithm is from the
	 *							   outer right subclass, going left to the
	 *							   first class argument.
	 *							   (should be meow classes)
	 * @param {Object} classImpl class implementation
	 *
	 * @example
	 * // simple classes
	 * var myClass1 = meow.Class({ x : alert("Hello1") });
	 * var myClass2 = meow.Class({ x : alert("Hello2"), y : alert("Bye2") });
	 * var myClass3 = meow.Class({ x : alert("Hello3") });
	 *
	 * // extend classes
	 *
	 * // myClass4.x => alert("Hello1")
	 * // myClass4.Super => myClass1
	 * var myClass4 = meow.Class(myClass1,{...});
	 *
	 * // myClass4.x => alert("Hello1"), myClass4.y => alert("Bye2")
	 * // myClass4.Super => myClass1
	 * var myClass4 = meow.Class(myClass1,myClass2,{...});
	 *
	 * @example
	 * Fork of http://myjs.fr/my-class/ 04.06.2011
	 * Current State: No changes
	 *
	 * @function
	 */
    meowEngine.Class = function(){

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

    /**
	 * Creates alongside with meow.Class a new class from the class
	 * implmentation and returns the singleton instance.
	 *
	 * @param {Object...} extendClass see {@link meow.Class}
	 * @param {Object} classImpl see {@link meow.Class}
	 * @return {Object} singleton instance
	 *
	 * @function
	 */
    meowEngine.Singleton = function(){
        var cl = Class.apply( null, arguments )
        return new cl();
    }

    var extendClass = function(Class, extension, override) {
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

    // var used for function as cache for Class function
    meowEngine.extendClass = extendClass;
    

    // CHECK FUNCTIONS
    //======================================================================

    /** @namespace */
    meowEngine.checks = {};

    /**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is a number, else false
	 */
	meowEngine.checks.isNumber = function( arg ){
		return typeof arg === 'number';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is a string, else false
	 */
	meowEngine.checks.isString = function( arg ){
		return typeof arg === 'string';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is a function, else false
	 */
	meowEngine.checks.isFunction = function( arg ){
		return typeof arg === 'function';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is undefined, else false
	 */
	meowEngine.checks.isUndefined = function( arg ){
		return typeof arg === 'undefined';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is an object, else false
	 */
	meowEngine.checks.isObject = function( arg ){
		return typeof arg === 'object';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is an array, else false
	 */
	meowEngine.checks.isArray = function( arg ){
		return typeof arg === 'object' && typeof arg.length === 'number';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is a boolean, else false
	 */
	meowEngine.checks.isBoolean = function( arg ){
		return typeof arg === 'boolean';
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is empty, else false
	 */
	meowEngine.checks.isEmpty = function( arg ){
		return arg.length === 0;
	};

	/**
	 * @function
	 * @param arg argument, that will be checked
	 * @return true, if the argument is not empty, else false
	 */
	meowEngine.checks.notEmpty = function( arg ){
		return arg.length !== 0;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are numbers, else false
	 */
	meowEngine.checks.areNumbers = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'number' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are strings, else false
	 */
	meowEngine.checks.areStrings = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'string' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are functions, else false
	 */
	meowEngine.checks.areFunctions = function(){

        var i, e = arguments.length;
        for( i = 0; i < e; i++ ){
            if( typeof arguments[i] !== 'function' ) return false;
        }

        return true;
    };

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are undefined, else false
	 */
	meowEngine.checks.areUndefined = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'undefined' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are objects, else false
	 */
	meowEngine.checks.areObjects = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'object' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are arrays, else false
	 */
	meowEngine.checks.areArrays = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'object' ||
				typeof arguments[i].length !== 'number' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are booleans, else false
	 */
	meowEngine.checks.areBooleans = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( typeof arguments[i] !== 'boolean' ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments are empty, else false
	 */
	meowEngine.checks.areEmpty = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( arguments[i].length !== 0 ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @return true, if all arguments aren't empty, else false
	 */
	meowEngine.checks.arentEmpty = function(){

		var i, e = arguments.length;
		for( i = 0; i < e; i++ ){
			if( arguments[i].length === 0 ) return false;
		}

		return true;
	};

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @param {Object} obj object where the arguments will searched
	 * @return true, if all arguments are in the object, else false
	 */
	meowEngine.checks.inObject = function(){

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
    };

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @param {Array} array array where the arguments will searched
	 * @return true, if all arguments are in the list, else false
	 */
	meowEngine.checks.inList = function(){

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
    };

	/**
	 * @function
	 * @param {Object} obj object that will be checked
	 * @param {String} property property that will be searched
	 * @param {String} type of the property (optional)
	 * @return true, if the property exists in the object, else false
	 */
	meowEngine.checks.hasAttribute = function( obj, property, type ){

        if( isObject(obj) ){
            return ( typeof type === 'string' )?
            typeof obj[property] !== type :
            typeof obj[property] !== 'undefined';
        }
        else return false;
    };

	/**
	 * @function
	 * @param {Varrags...} args objects, that will be checked
	 * @param {Class} cls class object
	 * @return true, if all arguments are instances of the class, else false
	 */
	meowEngine.checks.areInstancesOf = function(){

        var i;
        var e = arguments.length;
        var cls = arguments[e-1];

        for( i = 0; i < e-1; i++ ){
            if( !( arguments[i] instanceof cls ) ) return false;
        }

        return true;
    };


    // ERROR SYSTEM
    //======================================================================

    /**
     * Simple error class with support of type declaration and description
     * text.
     *
     * @class
     */
    meowEngine.Error = meowEngine.Class( meowEngine.rootCtx.Error,
                                    /** @lends meowEngine.Error# */ {

        constructor : function( name, desc ){
            this.name = name;
            this.desc = desc;
        },

        /**
         * Returns the error description.
         *
         * @function
         * @name description
         * @memberOf meowEngine.Error#
         */
        description : function type(){
            return this.desc;
        },

        /**
         * Returns the error type.
         *
         * @function
         * @name type
         * @memberOf meowEngine.Error#
         */
        type : function type(){
            return this.name;
        },

        toString : function(){
            return "["+this.name+"; "+this.desc+"]";
        }
    });

    /**
     * Generates an error object.
     *
     * @function
     * @param {String} type type of the error (e.g. IllegalArgument)
     * @param {String} msg message, that will be used as description
     *				   (optional)
     * @return meowEngine.Error object
     */
    meowEngine.createError = function createError( type, msg ){

        if( typeof type === 'string' ){

            var e = new meowEngine.Error();
            e.name = type;
            e.desc = (typeof msg === 'string')? msg : "";
            return e;
        }
        else{
            throw "type has to be a string";
        }
    };

    // PROPERTY MANAGER STUFF
    //======================================================================

    var propData = {};
    var propAttr = {};

    var _READONLY = 1;
    var _NOTREMOVEABLE = 2;

    /**
	 * Checks the existence of a given property.
	 *
	 * @function
	 * @param {String} key key of the property
	 * @return true, if exists, else false
	 */
    meowEngine.hasProperty = function( key ){

        if( !isString(key) ){
            throw "hasProperty, key has to be a string";
        }

        return typeof propData[key] !== 'undefined';
    }

    /**
	 * Deletes a property from property storage. Throws exception, if the
	 * property has a non remove-able status.
	 *
	 * @function
     * @memberOf meowEngine#
     * @param {String} key key of the property
	 */
     meowEngine.deleteProperty = function( key ){

        if( !isString(key) || !inList(key,propData) ){
            throw "deleteProperty, key has to be a string and registered in "+
                  "property manager";
        }

        var e = propAttr[key];
        if( e === _READONLY || e === _NOTREMOVEABLE ){
            throw "property is not removable!";
        }

        delete propData[key];
        delete propAttr[key];
    }

    /**
	 * Sets a property in the property manager of meow.
	 *
	 * @function
	 * @param {String} key key of the property
	 * @param value value that will be saved in the property
	 * @param {meow.CONST.NOTREMOVEABLE|meotypew.CONST.READONLY} attr constant
	 *		  for controlling the of the property (optional)
	 */
     meowEngine.setProperty = function( key, value, attr ){

        if( !isString(key) ){
            throw "setProperty, key has to be a string";
        }

        var e = propAttr[key];
        if( e === _READONLY ){
            throw "property is read only!";
        }

        propData[key] = value;

        if( attr === _NOTREMOVEABLE || attr === _READONLY ){
            if( typeof propAttr[key] === _ud ){
                propAttr[key] = attr;
            }
            else{
                throw "attributes of this property is already set";
            }
        }
    }

    /**
	 * Returns the value of a property.
	 *
	 * @function
	 * @param {String} key key of the property
	 * @return value of the property
	 */
    meowEngine.getProperty = function( key ){
        return propData[ key ];
    }

    /**
	 * Indicates the property manager to save a property as read only. This
	 * property can't be altered after being saved with this attribute.
	 *
	 * @constant
	 */
    meowEngine.READONLY = _READONLY;

    /**
	 * Indicates the property manager to make a property not remove able after
	 * it will be saved.
	 *
	 * @constant
	 */
    meowEngine.NOTREMOVEABLE = _NOTREMOVEABLE;


    // SIGNAL SYSTEM
    //======================================================================

    /**
	 * @class
	 */
	meowEngine.Signal = meowEngine.Class( /** @lends meowEngine.Signal# */ {

        /** */
        constructor : function(){

            /**
             * @private
             * @lends meowEngine.Signal#
             */
            this._data = [];
        },

        /**
         * Filters an argument with the listener functions.
         *
         * @param {Boolean} ignoreBreak if true, a return true of a filter, that
         *							    indicates a break of the filter chain,
         *							    will be ignored
         */
		dispatch : function( ignoreBreak, argList ){

            var list = this._data;
            var e = list.length;
            var res;

            // invoke argument on all filter objects
            for( var i = 0 ; i < e ; i++ )
            {
                res = list[i].apply(null,argList);

                // if no ignore on break and filter returns true,
                // then the chain will be broken
                if( ignoreBreak === false && res === true )
                    break;
            }

            list = null
        },

        /**
         * Adds a filter to the filter chain. The function get one argument by
         * the filter chain, if a filter process happens. The function can
         * return true, if the complete filter process should be breaked.
         *
         * @param {Function} func listener function
         * @param {Boolean} atFirst if true, the filter will appended at the
         *							head of the filter chain
         */
		add : function( func , atFirst ){
            ( atFirst === true )? this._data.unshift( func ) :
                                  this._data.push( func );
        },

        /**
         * Removes a listener from the signal.
         *
         * @param {Function} func listener function
         * @return true, if the function is removed, else false ( if e.g. the
         *		   function does not exists in the signal )
         */
		remove : function( func ){

            var i = this._data.indexOf( func );
            if( i != -1 ){

                this._data.splice( i , 1 );
                return true;
            }
            else{
                return false;
            }
        }
	});

    // meow's signal system
    var _signals = {}; // stores all connected global signals

    /** @namespace */
    meowEngine.signals = {};

    /**
	 * Dispatches a signal and invokes all connected listeners.
	 */
	meowEngine.signals.dispatch = function( sigName ){

		var sG = _signals[ sigName ];
		if( typeof sG === 'undefined' ){
            // no listeners connected
			return;
		}

		sG.dispatch( true, Array.prototype.slice.call(arguments, 1) );
	}

	/**
	 * Connects a listener to a signal.
	 *
	 * @param {sigName} sigName signal name
	 * @param {Function} listener listener function
	 */
	meowEngine.signals.onSignal = function( sigName, listener ){

		if( typeof sigName === 'undefined' || typeof listener !== 'function' ){
			throw "MeowEngine onSignal, illegal argument(s) given";
		}

		// exists signal already? If not, create it
		if( typeof _signals[ sigName ] === 'undefined' ){
			_signals[ sigName ] = new meowEngine.Signal();
		}

		_signals[ sigName ].add( listener );
	}

	/**
	 * Disconnects a listener from a signal.
	 *
	 * @param {sigName} sigName signal name
	 * @param {Function} listener listener function
	 */
	meowEngine.signals.remove = function( sigName, listener ){

		// exists signal already? If not, create it
		if( typeof _signals[ sigName ] === 'undefined' ){
			throw "MeowEngine removeFromSignal, signal does not exist";
		}

		_signals[ sigName ].remove( listener );
	}

    /**
     * Registers all meow variables with shortcuts
     */
    meowEngine.registerShortCuts = function(){

        meowEngine.signals.dispatch( meowEngine.MEOW_SHORTCUTS );

        // signal
        $signal = meowEngine.signals.dispatch;
        $onSignal = meowEngine.signals.onSignal;
        $notAtSignal = meowEngine.signals.remove;

        // properties
        $property = meowEngine.getProperty;
        $setProperty = meowEngine.setProperty;

        // error
        $error = meowEngine.createError;

        // logger
    }
})();