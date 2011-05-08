/**
 * This module introduces the assertment functions. Defined on root level to
 * provide easy usability with pre compiler expressions.
 *
 * @NOTE : will be replaced soon by a brigde to YASL assertions
 * @author Tapsi
 * @version 07.05.2011
 */

isNull = function( obj )
{
	if( obj != null )
		throw "isNullFailed"
}

notNull = function( obj )
{
	if( obj == null )
		throw "NotNullFailed"
}

notEmpty = function( obj )
{
	if(!( typeof obj === "string" && obj.length > 0 ))
		throw "NotEmptyFailed"
}

greater = function( num , value )
{
	if( ! ( typeof num === "number") )
		throw "GreaterFailed"

	if( num <= value )
		throw "GreaterFailed"
}

lower = function( num , value )
{
	if( ! ( typeof num === "number") )
		throw "GreaterFailed"

	if( num >= value )
		throw "LowerFailed"
}

equals = function( v1 , v2 )
{
	if( v1 !== v2 )
		throw "EqualsFailed"
}

isIn = function( obj , container )
{
	if( ! ( typeof container === "object") )
		throw "wrong arguments"
	
	for( tmp in container )
		if( container[tmp] === obj )
			return;

	throw "isInFailed"
}

notIn = function( obj , container )
{
	if( ! ( typeof container === "object") )
		throw "wrong arguments"

	for( tmp in container )
		if( container[tmp] === obj )
			throw "notInFailed"
}