package com.yasl.assertions;

import com.yasl.exception.AssertFailed;
import java.util.List;
import java.util.Map;

/**
 * Service class that provides many methods for assertions. Should be statical
 * imported to the classes where it should be used e.g. for parameter checks.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.12.2010
 */
public abstract class Assertions
{
    public static void assertNotNull( Object... objects ) throws AssertFailed
    {
        for( int i = 0 ; i < objects.length ; i++ )
            if( objects[i] == null ) throw new AssertFailed();
    }

    public static void assertIsNull( Object... objects ) throws AssertFailed
    {
        for( int i = 0 ; i < objects.length ; i++ )
            if( objects[i] != null ) throw new AssertFailed();
    }

    public static void assertNotNull( Object object ) throws AssertFailed
    {
        if( object == null ) throw new AssertFailed();
    }

    public static void assertIsNull( Object object ) throws AssertFailed
    {
        if( object != null ) throw new AssertFailed( );
    }

    public static void assertInList( Object object , List list ) throws AssertFailed
    {
        if( !list.contains(object) ) throw new AssertFailed( );
    }

    public static void assertNotInList( Object object , Object[] list ) throws AssertFailed
    {
        int l = list.length;
        for( int i = 0 ; i < l ; i++ )
            if( object == list[i] ) throw new AssertFailed();
    }

    public static void assertNotInList( Object object , List list ) throws AssertFailed
    {
        if( list.contains(object) ) throw new AssertFailed();
    }

    public static void assertInMap( Object object , Map map ) throws AssertFailed
    {
        if( !map.containsKey(object) ) throw new AssertFailed( );
    }

    public static void assertNotInMap( Object object , Map map ) throws AssertFailed
    {
        if( map.containsKey(object) ) throw new AssertFailed();
    }

    public static void assertTrue( boolean value ) throws AssertFailed
    {
        if( !value ) throw new AssertFailed();
    }

    public static void assertFalse( boolean value ) throws AssertFailed
    {
        if( value ) throw new AssertFailed();
    }

    public static void asserInRange( int value , int start , int endValue ) throws AssertFailed
    {
        if( start > endValue )
            throw new IllegalArgumentException("incorrect range arguments");

        if( value < start || value > endValue ) throw new AssertFailed();
    }

    public static void assertEquals( Object obj , Object... objs ) throws AssertFailed
    {
        for( int i = 0 ; i < objs.length ; i++ )
            if( objs.equals(obj) ) throw new AssertFailed();
    }
    
    public static void assertGreater( int value , int greaterAs ) throws AssertFailed
    {
        if( value <= greaterAs ) throw new AssertFailed();
    }

    public static void assertLower( int value , int lowerAs ) throws AssertFailed
    {
        if( value >= lowerAs ) throw new AssertFailed();
    }

    public static void assertGreaterEquals( int value , int greaterEq ) throws AssertFailed
    {
        if( value < greaterEq ) throw new AssertFailed();
    }

    public static void assertLowerEquals( int value , int lowerEq ) throws AssertFailed
    {
        if( value > lowerEq) throw new AssertFailed();
    }

    public static void startsWith( String str , String value )
    {
        assertNotNull(str,value);

        if( !str.startsWith(value) )
            throw new AssertFailed();
    }

    public static void endsWith( String str , String value )
    {
        assertNotNull(str,value);

        if( !str.endsWith(value) )
            throw new AssertFailed();
    }

	public static void isPositive( int num , String... messages )
	{
		if( num <= 0 )
			throw new AssertFailed( (messages != null)? messages:
                                new String[]{"an integer is not positive"} );
	}

	public static void isNegative( int num , String... messages )
	{
		if( num >= 0 )
			throw new AssertFailed( (messages != null)? messages:
                                new String[]{"an integer is not negative"} );
	}

	public static void isZero( int num , String... messages )
	{
		if( num == 0 )
			throw new AssertFailed( (messages != null)? messages:
                                    new String[]{"an integer is not zero"} );
	}

	public static void notEmpty( String str , String... messages )
	{
		if( str == null || str.length() == 0 )
			throw new AssertFailed( (messages != null)? messages:
               new String[]{"a string that should not be emoty, is empty"} );
	}

    public static void notNull( Object obj , String... messages )
	{
		if( obj == null )
			throw new AssertFailed( (messages != null)? messages:
                                     new String[]{"notNull assert failed"} );
	}

    public static void isGreater( int a, int b , String... messages )
	{
		if( a <= b )
			throw new AssertFailed( (messages != null)? messages:
                              new String[]{"is greater assertment failed"} );
	}

    public static void isGreaterEq( int a, int b , String... messages )
	{
		if( a < b )
			throw new AssertFailed( (messages != null)? messages:
                        new String[]{"is greater equals assertment failed"} );
	}

    public static void isLower( int a, int b , String... messages )
	{
		if( a >= b )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is lower assertment failed"} );
	}

    public static void isLowerEq( int a, int b , String... messages )
	{
		if( a > b )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"isGreater assertment failed"} );
	}

    public static void isEqual( int a, int b , String... messages )
	{
		if( a == b )
			throw new AssertFailed( (messages != null)? messages:
                         new String[]{"equals assertment failed"} );
	}

    public static void notEqual( int a, int b , String... messages )
	{
		if( a != b )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"not equals assertment failed"} );
	}

    public static void isIn( Object o , List list , String... messages )
	{
		if( list.contains(o) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is in assertment failed"} );
	}

    public static void isIn( Object o , Map list , String... messages )
	{
		if( list.containsKey(o) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is in assertment failed"} );
	}

    public static void notIn( Object o , List list , String... messages )
	{
		if( !list.contains(o) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is not in assertment failed"} );
	}

    public static void notIn( Object o , Map list , String... messages )
	{
		if( !list.containsKey(o) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is not in assertment failed"} );
	}

    public static void isTrue( boolean expression , String... messages )
	{
		if( !expression )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"is true in assertment failed"} );
	}

    public static void isBetween( int a, int from, int to, String... messages )
	{
		if( !( a >= from && a <= to ) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"range check failed"} );
	}

	public static void rangeBetween( int a, int b, int from, int to, String... messages )
	{
		if( !( a >= from && a >= b && b <= to ) )
			throw new AssertFailed( (messages != null)? messages:
                               new String[]{"range check failed"} );
	}
}
