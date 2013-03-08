package com.engine;

import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.MessageFormat;
import java.util.logging.ConsoleHandler;
import java.util.logging.Formatter;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.ScriptableObject;

/**
 * @author BlackCat
 */
public class JsContext {

    public static final Logger logger = Logger.getLogger( JsContext.class.getSimpleName() );

    private final Context jsCtx;
    private final ScriptableObject rootScope;

    /**
     * 
     * @param devLoad 
     */
    public JsContext( boolean devLoad ){

        logger.addHandler( new ConsoleHandler() );
        for( Handler h : logger.getHandlers() ){
            h.setFormatter( new SingleLineFormatter() );
            h.setLevel( Level.ALL );
        }
        logger.setLevel( Level.ALL );

        // CREATE CONTEXT
        this.jsCtx = Context.enter();
        jsCtx.setOptimizationLevel(9); // BE AGGRESSIVE !!!
        this.rootScope = jsCtx.initStandardObjects();

        loadDefaultObjects();
    }

    private void loadDefaultObjects() {

        // WINDOW OBJECT AKA ROOT
        evalExpression(
          "if( typeof window === 'undefined' ){"
             +"window = (function(){return this;}).call(null);"
         +"}");

        // DEFAULT LOGGER
        evalExpression(
          "console = {"
           +"log: function( msg ){"
             +"msg = 'GameEngine, '+msg;"
             +"com.engine.JsContext.logger.fine(msg);"
           +"}"
         +"}");
    }

    public Object evalExpression( String expr ){
        try{
            logger.fine("evaluate expression "+expr);
            return jsCtx.evaluateString(rootScope,expr, "", 0, null);
        }
        catch( EcmaError e ){
          logger.severe( MessageFormat.format( 
             "engine error err:{0} \ntrace:{1}",
                  e.getMessage(),
                  e.getScriptStackTrace()
            )
          );
          
          return null;
        }
    }

    public Object evaluateFile( File file) {
        try {
            logger.fine("evaluate file "+file.getAbsolutePath());

            return jsCtx.evaluateReader(
              rootScope,
              new FileReader(file),
              "",
              0,
              null
            );

        } catch (Exception ex) {
            logger.severe("can't compile file due: "+ex.getMessage());
            return null;
        }
    }

    /**
     * 
     */
    public static class SingleLineFormatter extends Formatter {

        private String lineSeparator = "\n";

        /**
         * Format the given LogRecord.
         * @param record the log record to be formatted.
         * @return a formatted log record
         */
        public synchronized String format(LogRecord record) {

            StringBuilder sb = new StringBuilder();


            // Class name
            if (record.getSourceClassName() != null) {
                sb.append(record.getSourceClassName());
            } else {
                sb.append(record.getLoggerName());
            }

            sb.append(" : "); // lineSeparator

            String message = formatMessage(record);

            sb.append(message);
            sb.append(lineSeparator);
            if (record.getThrown() != null) {
                try {
                    StringWriter sw = new StringWriter();
                    PrintWriter pw = new PrintWriter(sw);
                    record.getThrown().printStackTrace(pw);
                    pw.close();
                    sb.append(sw.toString());
                } catch (Exception ex) {
                }
            }
            return sb.toString();
        }
    }
    
    
}
