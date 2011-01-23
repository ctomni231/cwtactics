package com.yasl.logging;

import java.util.logging.LogRecord;
import java.util.logging.Formatter;
import com.yasl.exception.NotImplementedYetContext;
import com.yasl.exception.PrototypedContext;
import java.util.Properties;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;
import static com.yasl.assertions.Assertions.*;

/**
 * Simple logging service class, ideal for used as static import in classes.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 18.01.2011
 */
public abstract class Logging
{
    private static final Logger logger;

    static
    {
        YaslSimpleFormat formatter = new YaslSimpleFormat();
        ConsoleHandler cHandler = new ConsoleHandler();
        cHandler.setFormatter(formatter);

        logger = Logger.getLogger("com.yasl.log.Logging");
        logger.setUseParentHandlers(false);
        logger.addHandler(cHandler);
    }

    /**
     * Logs a simple message.
     *
     * @param message message string
     */
    public static void log( String message )
    {        
        assertNotNull(message);
        
        logger.log(Level.INFO, message);
    }

    /**
     * Logs a fine simple message in the logger.
     *
     * @param message message string
     */
    public static void fine( String message )
    {
        assertNotNull(message);
        
        logger.log(Level.FINE, message);
    }

    /**
     * Logs a warning simple message in the logger.
     *
     * @param message message string
     */
    public static void warn( String message )
    {
        assertNotNull(message);
        
        logger.log(Level.WARNING, message);
    }

    /**
     * Logs a critical simple message and logs the string representation of
     * an object in the logger.
     *
     * @param message message string
     */
    public static void critical( String message )
    {
        assertNotNull(message);

        logger.log(Level.SEVERE, message);
    }

    /**
     * Logs an runtime exception in the logger and throws the error at the end
     * of the method call.
     *
     * @param exception object that will be logged
     */
    public static void throwing( RuntimeException exception )
    {
        assertNotNull(exception);

        logger.log( Level.SEVERE, exception.getClass().getName() , exception );
        throw exception;
    }

    /**
     * Logs a statement that isn't implemented yet and throws a not implemented
     * yet exception.
     */
    public static void notImplemetedYet( )
    {
        NotImplementedYetContext e = new NotImplementedYetContext();

        logger.log( Level.SEVERE, e.toString() );
        throw e;
    }

    /**
     * Prototype marker, that creates a stack trace and logs it.
     */
    public static void prototyped()
    {
        PrototypedContext e = new PrototypedContext();

        logger.log( Level.INFO , e.toString() , e );
    }

    public static void criticalExit( String message )
    {
        critical(message);
        System.exit(1);
    }
    
    public static void deprecatedContext()
    {
        warn("Enter deprecated source context, this method should be avoided to be used");
    }

    public static void deprecatedContext( String methodName )
    {
        assertNotNull(methodName);
        
        warn(methodName+" is deprecated and should be avoided to be used");
    }

    private static class YaslSimpleFormat extends Formatter
    {
        @Override
        public String format(LogRecord rec)
        {
            StringBuilder buf = new StringBuilder(1000);

            buf.append( rec.getLevel().toString() );
            buf.append( ": " );
            buf.append( rec.getMessage() );
            buf.append( "\n" );
            return buf.toString();
        }
    }
}
