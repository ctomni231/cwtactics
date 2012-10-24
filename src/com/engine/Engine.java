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

    public static final String SOURCE_PATH = "srcEngine/";
    public static final String DEPS_PATH = "libJs/";
    public static final String MOD_PATH = "mod/";

    public static final String WORK_DIR = System.getProperty("user.dir");

    public final String[] FILES_DEV_ENGINE = new String[]{
      "engineBase","signals","utils","persistence","locale",
      "sheets","factory","map","move",
      "turn","battle","transport","property","clientAction"
    };

    public final String[] FILES_DEV_DEPENDENCIES = new String[]{
      "graph","astar","amanda"
    };

    public final String[] FILES_DEV_MOD = new String[]{
        "awds", "language", "movetypes", "scripts", "tiles", "weapons", "units"
    };

    public final String[] FILES_ENGINE = new String[]{ "gameEngine" };

    public final String[] FILES_DEPENDENCIES = new String[]{ "gameEngineDeps" };
    
    public final String[] FILES_MOD = new String[]{ "modification" };

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
        initConfig();
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

    private void initConfig(){
        configuration.put("CWT_INACTIVE_ID", -1);
        configuration.put("CWT_MAX_MAP_WIDTH", 100);
        configuration.put("CWT_MAX_MAP_HEIGHT", 100);
        configuration.put("CWT_MAX_PLAYER", 8);
        configuration.put("CWT_MAX_UNITS_PER_PLAYER", 50);
        configuration.put("CWT_MAX_PROPERTIES", 200);
        configuration.put("CWT_MAX_SELECTION_RANGE", 15);
        configuration.put("CWT_MAX_MOVE_RANGE", 15);
        configuration.put("CWT_MAX_BUFFER_SIZE", 200);
    }

    private void loadEngine( boolean devLoad ) {
        logger.fine("start loading engine");

        String[] deps = (devLoad)? FILES_DEV_DEPENDENCIES : FILES_DEPENDENCIES;
        String[] sources = (devLoad)? FILES_DEV_ENGINE : FILES_ENGINE;
        String[] mod = (devLoad)? FILES_DEV_MOD : FILES_MOD;

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
        
        logger.fine("load dependency files");
        for( int i=0,e=deps.length; i<e; i++ ){
          evaluateFile( getFile( DEPS_PATH, deps[i] ));
        }

        logger.fine("load engine files");
        for( int i=0,e=sources.length; i<e; i++ ){
          evaluateFile( getFile( SOURCE_PATH, sources[i] ));

          if( sources[i].equals("utils") && devLoad ){
              evalExpression("util.DEBUG = true;");
          }
        }

        logger.fine("load mod files");
        for( int i=0,e=mod.length; i<e; i++ ){
          evaluateFile( getFile( MOD_PATH, mod[i] ));
        }

        logger.fine("load mod");
        evalExpression("locale.language = 'de';");
        evalExpression("persistence.loadModification( CWT_MOD_DEFAULT );");
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

    /*
    public static void main( String[] args ){
        Engine e = new Engine(true);


        // LOW LEVEL HACKY :P 

        Object i;
        i = e.evalExpression("domain.mapWidth;");
        logger.fine("==> "+i.toString()+" -- "+i.getClass());

        i = e.evalExpression("CWT_MAX_MAP_WIDTH");
        logger.fine("==> "+i.toString()+" -- "+i.getClass());

        logger.fine("==> "+e.rootScope.get("CWT_MAX_MAP_WIDTH") );

        i = ((ScriptableObject) e.rootScope.get("domain")).get("mapWidth");
        logger.fine("==> "+i.toString()+" -- "+i.getClass());
    }
    */
}
