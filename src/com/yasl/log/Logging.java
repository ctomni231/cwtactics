package com.yasl.log;

import java.util.logging.Level;
import java.util.logging.Logger;
import static com.yasl.assertions.Assertions.*;

/**
 * Simple logging service class, ideal for used as static import in classes.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 17.01.2011
 */
public abstract class Logging
{
    private static final Logger logger = Logger.getLogger("com.yasl.log.Logging");

    public static void log( String message )
    {        
        assertNotNull(message);
        
        logger.log(Level.INFO, message);
    }

    public static void log( String message , Object o )
    {
        assertNotNull(message);
        assertNotNull(o);

        logger.log(Level.INFO, message, o);
    }

    public static void fine( String message )
    {
        assertNotNull(message);
        
        logger.log(Level.FINE, message);
    }

    public static void fine( String message , Object o )
    {
        assertNotNull(message);
        assertNotNull(o);
        
        logger.log(Level.FINE, message, o);
    }

    public static void warn( String message )
    {
        assertNotNull(message);
        
        logger.log(Level.WARNING, message);
    }

    public static void warn( String message , Object o )
    {
        assertNotNull(message);
        assertNotNull(o);
        
        logger.log(Level.WARNING, message, o);
    }

    public static void critical( String message )
    {
        assertNotNull(message);

        logger.log(Level.SEVERE, message);
    }

    public static void critical( String message , Object o )
    {
        assertNotNull(message);
        assertNotNull(o);

        logger.log(Level.SEVERE, message, o);
    }

    public static void entering( String sClass, String sMethod )
    {
        assertNotNull(sClass);
        assertNotNull(sMethod);

        logger.entering(sClass, sMethod);
    }

    public static void entering( String sClass, String sMethod , Object o )
    {
        assertNotNull(sClass,sMethod,o);

        logger.entering( sClass, sMethod , o);
    }

    public static void exiting( String sClass, String sMethod )
    {
        assertNotNull(sClass);
        assertNotNull(sMethod);

        logger.exiting(sClass, sMethod);
    }

    public static void exiting( String sClass, String sMethod , Object o )
    {
        assertNotNull(sClass,sMethod,o);

        logger.exiting( sClass, sMethod , o);
    }

    public static void throwing( String sClass, String sMethod , Throwable o )
    {
        assertNotNull(sClass,sMethod,o);

        logger.throwing( sClass, sMethod , o);
    }


}
