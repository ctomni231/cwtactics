package com.engine;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.mozilla.javascript.ScriptableObject;

/**
 *
 * @author BlackCat
 */
public class EngineHolder {
    
    public static final Logger logger = Logger.getLogger("JS Engine Holder");

    public enum ENGINE_MODULE {
        GAME,SIGNAL,CONTROLLER
    }
    
    private Engine engine;

    private ScriptableObject mod_game;
    private ScriptableObject mod_signal;
    private ScriptableObject mod_controller;

    public EngineHolder( Engine e ){

        logger.addHandler( new ConsoleHandler() );
        for( Handler h : logger.getHandlers() ){
            h.setFormatter( new Engine.SingleLineFormatter() );
            h.setLevel( Level.ALL );
        }
        logger.setLevel( Level.ALL );
        
        this.engine = e;

        // RECEIVE SCOPES
        mod_game = (ScriptableObject) e.evalExpression("game");
        mod_signal = (ScriptableObject) e.evalExpression("signal");
        mod_controller = (ScriptableObject) e.evalExpression("controller");
    }

    private ScriptableObject getScopeByMod( ENGINE_MODULE mod ){
        switch( mod ){
            case GAME: return mod_game;
            case SIGNAL: return mod_signal;
            case CONTROLLER: return mod_controller;
            default: throw new IllegalArgumentException("unknown module");
        }
    }

    public static Number asNumber( Object o ){
        return (Number) o;
    }

    public static String asString( Object o ){
        return o.toString();
    }

    public static boolean asBoolean( Object o ){
        return (Boolean) o;
    }

    public static ScriptableObject asJsObject( Object o ){
        return (ScriptableObject) o;
    }

    public Object callFunction( ENGINE_MODULE mod, String fn, Object... args ){
        ScriptableObject scope = getScopeByMod(mod);
        return ScriptableObject.callMethod(scope, fn, args);
    }

    public Object getProperty( ENGINE_MODULE mod, String name ){
        ScriptableObject scope = getScopeByMod(mod);
        return scope.get(name);
    }

    // TEST IT
    public static void main( String[] args ){
        boolean dev = true;

        Engine e = new Engine( dev );
        EngineHolder eH = new EngineHolder(e);

        // SHOULD BE 0
        logger.fine("controller.currentState = "+
          asString( eH.getProperty( ENGINE_MODULE.CONTROLLER, "currentState"))
        );
        
        // SHOULD BE 0
        logger.fine("game.mapWidth() = "+
          asString( eH.callFunction( ENGINE_MODULE.GAME, "mapWidth"))
        );

        /*
         SIMPLE SHELL TO TEST IT

 domain.players
com.engine.Engine : evaluate expression domain.players
com.engine.EngineHolder : => org.mozilla.javascript.NativeArray@3c6833f2
xxx
com.engine.Engine : evaluate expression xxx
com.engine.Engine : engine error err:ReferenceError: "xxx" is not defined.
trace:        at :0

24.10.2012 20:33:26 com.engine.Engine evalExpression
SCHWERWIEGEND: engine error err:ReferenceError: "xxx" is not defined.
trace:        at :0

com.engine.EngineHolder : => null
xxx = 19
com.engine.Engine : evaluate expression xxx = 19
com.engine.EngineHolder : => 19
xxx
com.engine.Engine : evaluate expression xxx
com.engine.EngineHolder : => 19
game.loadMap
com.engine.Engine : evaluate expression game.loadMap
com.engine.EngineHolder : => org.mozilla.javascript.Undefined@31a3ca10
game.day
com.engine.Engine : evaluate expression game.day
com.engine.EngineHolder : => org.mozilla.javascript.gen.c_25@666c5482
game.day();
com.engine.Engine : evaluate expression game.day();
com.engine.EngineHolder : => 0.0


         */

        BufferedReader console = new BufferedReader(new InputStreamReader(System.in));
        String input;
        while( true ){
            try {
                input = console.readLine();
                if( input.equals("exit") ) System.exit(0);
                else{
                    logger.fine("=> "+e.evalExpression(input));
                }
            } catch (IOException ex) {
                Logger.getLogger(EngineHolder.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
}
