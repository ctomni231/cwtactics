package com.engine;

import java.io.File;
import java.io.FileReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
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
public class Engine {

    public static final Logger logger = Logger.getLogger("JS Engine");

    public static final String SOURCE_PATH = "jsBin/nightly/normal/";
    public static final String MAPS_PATH = "maps/";

    public static final String WORK_DIR = System.getProperty("user.dir");

    public final String[] FILES = new String[]{ 
        "gameConf","engineDeps","engine","mod"
    };

    public final String[] DEV_FILES = new String[]{
        "gameConf","engineDeps","engine_debug","mod"
    };

    public final String[] MAPS = new String[]{ "testMap" };

    private final Context jsCtx;
    private final ScriptableObject rootScope;
   
    public final Map<String,Integer> configuration =
            new HashMap<String, Integer>();

    /**
     * 
     * @param pathEngine path of the game engine
     * @param  pathDeps path of the dependencies
     * @param devLoad if true all parts will be loaded as separate files 
     *                (like coded in dev phase) else only one script 
     *                "gameEngine.js" and "gameEngine_deps.js"
     *                will be loaded
     */
    public Engine( boolean devLoad ){

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

        // LOAD ENGINE
        loadDefaultObjects();
        loadEngine(devLoad);
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
             +"com.engine.Engine.logger.fine(msg);"
           +"}"
         +"}");
    }

    private void loadEngine( boolean devLoad ) {
        logger.fine("start loading engine");

        String[] files = (devLoad)? DEV_FILES : FILES;

        logger.fine("load configuration");
        Set<String> configKeys = configuration.keySet();
        Iterator<String> configIt = configKeys.iterator();
        while( configIt.hasNext() ){
            String key = configIt.next();
            String expr = MessageFormat.format("{0} = {1};",
                    key ,
                    configuration.get(key)
            );

            evalExpression( expr );
        }
        
        logger.fine("load files");
        for( int i=0,e= files.length; i<e; i++ ){
          evaluateFile( getFile( SOURCE_PATH, files[i] ));
        }

        logger.fine("load maps");
        for( int i=0,e= MAPS.length; i<e; i++ ){
          evaluateFile( getFile( MAPS_PATH, MAPS[i] ));
        }

        logger.fine("load mod");
        evalExpression("function __invoke( key ){ var data = controller.aquireActionDataObject(); data.setAction( key ); controller.pushActionDataIntoBuffer( data ); }");
        evalExpression("__invoke( 'loadMod' );");
        evalExpression("var data = controller.aquireActionDataObject(); data.setAction( 'loadGame' ); data.setSubAction( testMap ); controller.pushActionDataIntoBuffer( data );");
        evalExpression("util.i18n_setLanguage('en');");
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

    private Object evaluateFile( File file) {
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

    private File getFile( String sPath, String fPath ){
        return new File(
          (new StringBuilder())
            .append( WORK_DIR ).append("/")
            .append( sPath )
            .append( fPath )
            .append(".js")
            .toString()
        );
    }
    
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
