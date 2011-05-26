/**
 * Assertments for expression checkment.
 *
 * @author Tapsi
 * @since 15.05.2011
 * @namespace
 */
meow.assert =
/** @lends meow.assert# */
{
	/** @throws {isTrueFailed} if the expression does not match the criteria */
	isTrue : function( expression )
	{
		if( !expression )
			throw "isTrueFailed"
	},

	/** @throws {isTrueFailed} if the expression does not match the criteria */
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

if( !meow.noConflict )
	assert = meow.assert