package com.meowEngine_RhinoStack.java;

import java.lang.reflect.InvocationTargetException;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.ConsoleHandler;
import java.util.logging.LogRecord;
import java.util.logging.Formatter;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowConsole extends ScriptableObject
{
	private static final Logger logger;

    static
    {
        SimpleFormatter formatter = new SimpleFormatter();
        ConsoleHandler cHandler = new ConsoleHandler();
        cHandler.setFormatter(formatter);

        logger = Logger.getLogger("com.meowEngine.Console");
        logger.setUseParentHandlers(false);
        logger.addHandler(cHandler);
    }

	public static void jsStaticFunction_info( String msg )
	{
		logger.info(msg);
	}
	
	public static void jsStaticFunction_warn( String msg )
	{
		logger.warning(msg);
	}

	public static void jsStaticFunction_critical( String msg )
	{
		logger.severe(msg);
	}

	@Override
	public String getClassName()
	{
		return "MeowConsole";
	}

	private static class SimpleFormatter extends Formatter
    {
        @Override
        public String format(LogRecord rec)
        {
            StringBuilder buf = new StringBuilder(1000);

            //buf.append( rec.getLoggerName() );
			buf.append( "MeowEngine ");
			buf.append( rec.getLevel().toString() );
            buf.append( ": " );
            buf.append( rec.getMessage() );
            buf.append( "\n" );
			
            return buf.toString();
        }
    }
}
