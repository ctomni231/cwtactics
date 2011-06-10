(function(){
	
	if( typeof meow !== 'undefined' ){
		throw "MeowCore already placed as namespace";
	}

	/**
	 * MeowEngine kernel object.
	 * 
	 * @namespace
	 */
	meow = /** @lends meow# */ {

		VERSION : 0.9,

		/**
		 * Empty function object.
		 */
		EMPTY_FUNCTION : function(){},

		rootContext : window,

		/**
		 * Returns the name of a function object.
		 */
		getFunctionName : function( func )
		{
			var str = ((func.toString()).match(/( \w+)/)[0]);
			str = str.slice( 1 , str.length );

			return str;
		},

		setObjectValue : function( namespace , value )
		{
			var p = namespace.lastIndexOf(".");
			var attr = namespace.slice( p+1 );

			namespace = namespace.slice( 0 , p );

			this.getObjectValue( namespace )[attr] = value;
		},

		getObjectValue : function( namespace )
		{
			namespace = namespace.split(".");
			var obj = meow.sys.getGlobal();

			for( var i = 0 ; i < namespace.length ; i++ )
			{
				obj = obj[ namespace[i] ];
			}

			return obj;
		},
		
		NEED_TO_BE_IMPLEMENTED : function(){
			throw "This function is a place holder and must not be called!";
		}

	};

	//----------------------------------------------------------------------

	var propData = {};

	meow.hasProperty = function( key ){
		return typeof propData[key] !== 'undefined';
	};

	meow.setProperty = function( key, value ){
		propData[key] = value;
	};

	meow.getProperty = function( key ){
		return propData[key];
	};

	//----------------------------------------------------------------------

	/**
	 * Runs a function in the background.
	 *
	 * This function should be only used in games, if no other way is
	 * possible. Depends on WebWorker in web enbvironments. If no WebWorker
	 * will be placed here, then the function will be called directly and
	 * the function returns, if the target function is done.
	 */
	meow.asyncCall = function( func , thisObj , arguments ){
		// default fallback content, calls the target function
		func.apply( thisObj , arguments );
	}

	//----------------------------------------------------------------------

	var Class = function() {

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

	};

	var Singleton = function(){
		var cl = Class.apply( null, arguments )
		return new cl();
	};

	var extendClass = function(Class, extension, override) {
		if (extension.STATIC) {
			extend(Class, extension.STATIC, override);
			delete extension.STATIC;
		}
		extend(Class.prototype, extension, override)
	};

	var extend = function(obj, extension, override) {
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
	};

	/**
	 * Creates a new class with a given class implementation
	 *
	 * @param {Object...} extendClass class(es) that will be extended. Is a
	 *							   variable argument, so you can set as many 
	 *							   classes you want. The first class you define
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
	 *
	 * @function
	 */
	meow.Class = Class;

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
	meow.Singleton = Singleton;

	meow.extendClass = extendClass;

	//----------------------------------------------------------------------

	var assert = /** @lends meow.assert# */ {
	
		/** @throws {isTrueFailed} if the expression does not match the
		 *						   criteria
		 */
		isTrue : function( expression )
		{
			if( !expression )
				throw "isTrueFailed"
		},

		isInstance : function( obj, classObj )
		{
			if( obj && classObj )
			{
				return obj instanceof classObj;
			}
			else
				throw "isInstanceFailed"
		},

		/** @throws {isTrueFailed} if the expression does not match the
		 *						   criteria
		 */
		isFalse : function( expression )
		{
			if( expression )
				throw "isFalseFailed"
		},

		/** @throws {isFunctionFailed} if the expression does not match the
		 *							   criteria */
		isFunction : function( obj )
		{
			if( typeof obj !== 'function' )
				throw "isFunctionFailed"
		},

		/** @throws {isNumberFailed} if the expression does not match the criteria*/
		isNumber : function( obj )
		{
			if( typeof obj !== 'number' )
				throw "isNumberFailed"
		},

		/** @throws {isStringFailed} if the expression does not match the criteria*/
		isString : function( obj )
		{
			if( typeof obj !== 'string' )
				throw "isStringFailed"
		},

		/** @throws {isArrayFailed} if the expression does not match the criteria */
		isArray : function( obj )
		{
			if( typeof obj !== 'object' || !obj.length )
				throw "isArrayFailed"
		},

		/** @throws {isObjectFailed} if the expression does not match the criteria*/
		isObject : function( obj )
		{
			if( typeof obj !== 'object' )
				throw "isObjectFailed"
		},

		/** @throws {isNullFailed} if the expression does not match the criteria */
		isNull : function( obj )
		{
			if( obj != null )
				throw "isNullFailed"
		},

		/** @throws {NotNullFailed} if the expression does not match the criteria */
		notNull : function( obj )
		{
			if( obj == null )
				throw "NotNullFailed"
		},

		/** @throws {NotEmptyFailed} if the expression does not match the criteria
		  *	@throws {IllegalArgument} if an argument is not correct for this
		  *							  assertment  */
		notEmpty : function( obj )
		{
			if( typeof obj !== "string" )
				throw "IllegalArgument"

			if( obj.length == 0 )
				throw "NotEmptyFailed"
		},

		/** @throws {GreaterFailed} if the expression does not match the criteria
		  *	@throws {IllegalArgument} if an argument is not correct for this
		  *							  assertment  */
		greater : function( num , value )
		{
			if( ! ( typeof num === "number") )
				throw "IllegalArgument"

			if( num <= value )
				throw "GreaterFailed"
		},

		/** @throws {LowerFailed} if the expression does not match the criteria
		  *	@throws {IllegalArgument} if an argument is not correct for this
		  *							  assertment  */
		lower : function( num , value )
		{
			if( ! ( typeof num === "number") )
				throw "IllegalArgument"

			if( num >= value )
				throw "LowerFailed"
		},

		/** @throws {EqualsFailed} if the expression does not match the criteria */
		equals : function( v1 , v2 )
		{
			if( v1 !== v2 )
				throw "EqualsFailed"
		},

		/** @throws {isInFailed} if the expression does not match the criteria
		  *	@throws {IllegalArgument} if an argument is not correct for this
		  *							  assertment  */
		isIn : function( obj , container )
		{
			var type = typeof container
			if( type === "object" )
			{
				if( container.length )
					for( var i = 0 ; i < container.length ; i++ )
						if( container[i] === obj ) return
				else
					for( tmp in container )
						if( container[tmp] === obj ) return

				throw "isInFailed"
			}
			throw "IllegalArgument"
		},

		/** @throws {notInFailed} if the expression does not match the criteria
		  *	@throws {IllegalArgument} if an argument is not correct for this
		  *							  assertment  */
		notIn : function( obj , container )
		{
			var type = typeof container
			if( type === "object" )
			{
				if( container.length )
					for( var i = 0 ; i < container.length ; i++ )
						if( container[i] === obj ) throw "notInFailed"
				else
					for( tmp in container )
						if( container[tmp] === obj ) throw "notInFailed"
			}
			throw "IllegalArgument"
		}
	}

	/**
	 * @namespace
	 */
	meow.assert = assert;

	//----------------------------------------------------------------------

	/**
	 * http://www.JSON.org/json2.js
	 * 2011-02-23
	 * Public Domain.
	 *
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 * See http://www.JSON.org/js.html
	 */
	if(!this.JSON){this.JSON={}}(function(){function l(c){return c<10?'0'+c:c}if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(c){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+l(this.getUTCMonth()+1)+'-'+l(this.getUTCDate())+'T'+l(this.getUTCHours())+':'+l(this.getUTCMinutes())+':'+l(this.getUTCSeconds())+'Z':null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(c){return this.valueOf()}}var o=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,m,r={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},j;function q(a){p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function(c){var f=r[c];return typeof f==='string'?f:'\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function n(c,f){var a,e,d,i,k=h,g,b=f[c];if(b&&typeof b==='object'&&typeof b.toJSON==='function'){b=b.toJSON(c)}if(typeof j==='function'){b=j.call(f,c,b)}switch(typeof b){case'string':return q(b);case'number':return isFinite(b)?String(b):'null';case'boolean':case'null':return String(b);case'object':if(!b){return'null'}h+=m;g=[];if(Object.prototype.toString.apply(b)==='[object Array]'){i=b.length;for(a=0;a<i;a+=1){g[a]=n(a,b)||'null'}d=g.length===0?'[]':h?'[\n'+h+g.join(',\n'+h)+'\n'+k+']':'['+g.join(',')+']';h=k;return d}if(j&&typeof j==='object'){i=j.length;for(a=0;a<i;a+=1){e=j[a];if(typeof e==='string'){d=n(e,b);if(d){g.push(q(e)+(h?': ':':')+d)}}}}else{for(e in b){if(Object.hasOwnProperty.call(b,e)){d=n(e,b);if(d){g.push(q(e)+(h?': ':':')+d)}}}}d=g.length===0?'{}':h?'{\n'+h+g.join(',\n'+h)+'\n'+k+'}':'{'+g.join(',')+'}';h=k;return d}}if(typeof JSON.stringify!=='function'){JSON.stringify=function(c,f,a){var e;h='';m='';if(typeof a==='number'){for(e=0;e<a;e+=1){m+=' '}}else if(typeof a==='string'){m=a}j=f;if(f&&typeof f!=='function'&&(typeof f!=='object'||typeof f.length!=='number')){throw new Error('JSON.stringify');}return n('',{'':c})}}if(typeof JSON.parse!=='function'){JSON.parse=function(i,k){var g;function b(c,f){var a,e,d=c[f];if(d&&typeof d==='object'){for(a in d){if(Object.hasOwnProperty.call(d,a)){e=b(d,a);if(e!==undefined){d[a]=e}else{delete d[a]}}}}return k.call(c,f,d)}o.lastIndex=0;if(o.test(i)){i=i.replace(o,function(c){return'\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(i.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){g=eval('('+i+')');return typeof k==='function'?b({'':g},''):g}throw new SyntaxError('JSON.parse');}}}());

	meow.toJSON=JSON.stringify;
	meow.parseJSON=JSON.parse;
})();