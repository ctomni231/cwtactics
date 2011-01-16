package com.yasl.assertions;

import com.yasl.exception.AssertFailed;
import java.util.List;
import java.util.Map;
import static com.yasl.assertions.AssertionMessages.*;

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
        if( !list.contains(object) ) throw new AssertFailed( objectIsntInCollection(object) );
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
        if( !map.containsKey(object) ) throw new AssertFailed( objectIsntInCollection(object) );
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
        if( start < endValue )
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
}
