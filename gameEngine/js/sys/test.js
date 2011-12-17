/**
 * A very simple runtime check library for javaScript. It's design is heavily 
 * inspired by the jasmine BDD framework. But unlike jasmine, nekos testing 
 * module allows dynamic runtime checking with select able debug modes.
 * 
 * @author BlackCat
 * @since 7.12.2011
 */
define( ["cwt/properties"], function( props ){
	
	/*************
	 * VARIABLES *
	 *************/
	
	var _debug = props.DEBUG_MODE;

	var _error = function( msg )
	{
		throw new Error( msg );
	};
	
	
	/******************
	 * IMPLEMENTATION *
     ******************/
	
	/**
	 * Value holder class.
	 */
	var _valHolder = my.Class({
		
		constructor: function( value )
		{ 
			this.value = value;
		},
		
		/**
		 * Checks the equality with '==='.
		 * 
		 * @param exp
		 */
		toBe: function( exp )
		{
			if( this.value !== exp ) _error("is not expected");
			return this;
		},
		
		isString: function()
		{
			if( typeof( this.value ) !== 'string' ) _error("not a string");
			return this;
		},
		
		isArray: function()
		{
			// !== or != ?
			if( obj.constructor !== Array ) _error("not an array");
			return this;
		},
		
		isNumber: function()
		{
			if( !isNum(exp) ) _error("not a number");
			return this;
		},
		
		isInteger: function()
		{
			var _n = this.value;
			if(!(typeof _n == 'number' && _n % 1 == 0)) _error("not an integer");
			return this;
		},
		
		isUndefined: function()
		{
			if( typeof( this.value ) !== 'undefined') _error("not undefined");
			return this;
		},
		
		greater: function( num )
		{
			if( this.value <= num ) _error("greater failed");
			return this;
		},
		
		lower: function( num )
		{
			if( this.value >= num ) _error("lower failed");
			return this;
		},
		
		greaterEq: function( num )
		{
			if( this.value < num ) _error("greater equals failed");
			return this;
		},
		
		lowerEq: function( num )
		{
			if( this.value > num ) _error("lower equals failed");
			return this;
		},
		
		hasProperty: function( prop )
		{
			if( !this.value.hasOwnProperty(prop) ) _error("has property failed");
			return this;
		},
		
		isPropertyOf: function( obj )
		{
			if( !obj.hasOwnProperty( this.value ) ) _error("is property of failed");
			return this;
		},
		
		isntPropertyOf: function( obj )
		{
			if( obj.hasOwnProperty( this.value ) ) _error("is not property of failed");
			return this;
		},
		
		isBlank: function()
		{
			if( !(/^\s*$/).test(str) ) _error("isBlank failed");
			return this;
		},
		
		isntBlank: function()
		{
			if( (/^\s*$/).test(str) ) _error("is not Blank failed");
			return this;
		},
		
		/**
		 * Is the expected value in an array?
		 * 
		 * @param array
		 */
		isIn: function( obj )
		{
			if( obj.constructor === Array && !obj.contains(this.value) ) 
				_error();
			
			else if( obj.constructor === Object )
				for( var i in obj )
					if( obj.hasOwnProperty(i) && i === this.value.toString() )
						_error();
			
			return this;
		}
	});

	return {
		
		isDebug: function()
		{ 
			return _debug; 
		},
		
		expect: function( value )
		{
			return new _valHolder( value );
		}
	};
});