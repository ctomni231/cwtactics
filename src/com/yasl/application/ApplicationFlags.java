package com.yasl.application;

import java.util.Properties;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;

/**
 * Global application flag/parameter service class, contains some services to
 * handle simple flag data for an application globally. This class should be
 * added via static import to get a easy use ability.
 * <br><br>
 * This implementation should be thread safe ( not 100% tested ).
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public final class ApplicationFlags
{
    // some useful flags
    private static String DEFAULT_VALUE = "SETTED";
    public static String COMPILER_DEBUG = "C_DEBUG";
    public static String RUNTIME_DEBUG = "R_DEBUG";

    private static Properties properties;

    static
    {
        properties = new Properties();
    }

    public static void setAppFlag( String flagKey )
    {
        assertNotNull(flagKey);

        synchronized( ApplicationFlags.class )
        {
            properties.setProperty( flagKey , DEFAULT_VALUE );
        }
    }

    public static void setAppFlag( String flagKey , String flagValue )
    {
        assertNotNull(flagKey);
        assertNotNull(flagValue);
        
        synchronized( ApplicationFlags.class )
        {
            properties.setProperty( flagKey , flagValue);
        }
    }

    public static boolean appFlagExist( String flagKey )
    {
        assertNotNull(flagKey);

        return properties.containsKey(flagKey);
    }

    public static String getAppFlag( String flagKey )
    {
        assertTrue( appFlagExist(flagKey) );

        return properties.getProperty(flagKey);
    }

    public static int getAppFlag_as_Int( String flagKey )
    {
        assertTrue( appFlagExist(flagKey) );

        try
        {
            return Integer.parseInt( properties.getProperty(flagKey) );
        }
        catch( NumberFormatException e )
        {
            throw new IllegalArgumentException("flag doesn't contain a number =>"+flagKey);
        }
    }

    public static boolean appFlagEquals( String flagKey , String flagValue )
    {
        assertTrue( appFlagExist(flagKey) );
        assertNotNull(flagValue);

        return properties.getProperty(flagKey).equals(flagValue);
    }

    public static void removeAppFlag( String flagKey )
    {
        assertNotNull(flagKey);

        synchronized( ApplicationFlags.class )
        {
            properties.remove(flagKey);
        }
    }
}
