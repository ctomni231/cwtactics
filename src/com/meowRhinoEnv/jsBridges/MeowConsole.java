package com.meowRhinoEnv.jsBridges;

import java.util.logging.Logger;
import java.util.logging.ConsoleHandler;
import java.util.logging.LogRecord;
import java.util.logging.Formatter;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowConsole extends JsBridge
{
	private static final Logger logger;

    static
    {
        SimpleFormatter formatter = new SimpleFormatter();
        ConsoleHandler cHandler = new ConsoleHandler();
        cHandler.setFormatter(formatter);

        logger = Logger.getLogger("MeowEngine");
        logger.setUseParentHandlers(false);
        logger.addHandler(cHandler);
    }

	public void jsFunction_info( String msg )
	{
		logger.info(msg);
	}

	public void jsFunction_log( String msg )
	{
		logger.info(msg);
	}

	public void jsFunction_warn( String msg )
	{
		logger.warning(msg);
	}

	public void jsFunction_critical( String msg )
	{
		logger.severe(msg);
	}

	private static class SimpleFormatter extends Formatter
    {
        @Override
        public String format(LogRecord rec)
        {
            StringBuilder buf = new StringBuilder(1000);

			buf.append( "MeowEngine => " );
            buf.append( rec.getMessage() );
            buf.append( "\n" );
			
            return buf.toString();
        }
    }
}
