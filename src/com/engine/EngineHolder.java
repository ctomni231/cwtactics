package com.engine;

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

    public enum ENGINE_MODULE { VIEW,UTIL,CONTROLLER,MODEL,GLOBAL }
    
    private Engine engine;

    private ScriptableObject mod_view;
    private ScriptableObject mod_util;
    private ScriptableObject mod_controller;
    private ScriptableObject mod_model;
    private ScriptableObject mod_global;

    public EngineHolder( Engine e ){

        logger.addHandler( new ConsoleHandler() );
        for( Handler h : logger.getHandlers() ){
            h.setFormatter( new Engine.SingleLineFormatter() );
            h.setLevel( Level.ALL );
        }
        logger.setLevel( Level.ALL );
        
        this.engine = e;

        // RECEIVE SCOPES
        mod_view = (ScriptableObject) e.evalExpression("view");
        mod_util = (ScriptableObject) e.evalExpression("util");
        mod_model = (ScriptableObject) e.evalExpression("model");
        mod_controller = (ScriptableObject) e.evalExpression("controller");
        mod_global = (ScriptableObject) e.evalExpression("window");
    }

    private ScriptableObject getScopeByMod( ENGINE_MODULE mod ){
        switch( mod ){
            case VIEW: return mod_view;
            case UTIL: return mod_util;
            case CONTROLLER: return mod_controller;
            case MODEL: return mod_model;
            case GLOBAL: return mod_global;
            default: throw new IllegalArgumentException("unknown module");
        }
    }

    public static Number castNumber( Object o ){
        return (Number) o;
    }

    public static String castString( Object o ){
        return o.toString();
    }

    public static boolean castBoolean( Object o ){
        return (Boolean) o;
    }

    public static boolean lowerThen( Object o, double num ){
        if( o == null ) throw new IllegalArgumentException();
        if( o instanceof Number ){
            if( o instanceof Double && ((Double) o).doubleValue() < num ) return true;
            else if(o instanceof Float && ((Float) o).floatValue() < num) return true;
            else if(o instanceof Integer && ((Integer) o).intValue() < num) return true;
            else throw new IllegalArgumentException();
        }
        throw new IllegalArgumentException();
    }

    public static boolean lowerEquals( Object o, double num ){
        if( o == null ) throw new IllegalArgumentException();
        if( o instanceof Number ){
            if( o instanceof Double && ((Double) o).doubleValue() <= num ) return true;
            else if(o instanceof Float && ((Float) o).floatValue() <= num) return true;
            else if(o instanceof Integer && ((Integer) o).intValue() <= num) return true;
            else throw new IllegalArgumentException();
        }
        throw new IllegalArgumentException();
    }

    public static boolean greaterEquals( Object o, double num ){
        if( o == null ) throw new IllegalArgumentException();
        if( o instanceof Number ){
            if( o instanceof Double && ((Double) o).doubleValue() >= num ) return true;
            else if(o instanceof Float && ((Float) o).floatValue() >= num) return true;
            else if(o instanceof Integer && ((Integer) o).intValue() >= num) return true;
            else throw new IllegalArgumentException();
        }
        throw new IllegalArgumentException();
    }

    public static boolean greaterThen( Object o, double num ){
        if( o == null ) throw new IllegalArgumentException();
        if( o instanceof Number ){
            if( o instanceof Double && ((Double) o).doubleValue() > num ) return true;
            else if(o instanceof Float && ((Float) o).floatValue() > num) return true;
            else if(o instanceof Integer && ((Integer) o).intValue() > num) return true;
            else throw new IllegalArgumentException();
        }
        throw new IllegalArgumentException();
    }

    public static boolean equals( Object o, Object exp ){
        if( o == null || exp == null ){
            if( o == null && exp == null ) return true;
            else throw new IllegalArgumentException();
        }
        if( o.toString().equals( exp.toString() ) );
        throw new IllegalArgumentException();
    }

    public static boolean isTrue( Object o ){
        if( o == null ) throw new IllegalArgumentException();
        if( o instanceof Boolean && ((Boolean) o).equals(Boolean.TRUE) ){
            return true;
        }
        else if( o.toString().equalsIgnoreCase( Boolean.TRUE.toString() ) ){
            return true;
        }
        return false;
    }

    public static boolean isFalse( Object o ){
        if( o == null ) throw new IllegalArgumentException();
        return !isTrue(o);
    }

    public static ScriptableObject castJsObject( Object o ){
        return (ScriptableObject) o;
    }

    /**
     * Calls a javascript function and returns its result.
     * 
     * @param mod
     * @param fn
     * @param args
     * @return
     */
    public Object callFunction( ENGINE_MODULE mod, String fn, Object... args ){
        ScriptableObject scope = getScopeByMod(mod);
        return ScriptableObject.callMethod(scope, fn, args);
    }

    /**
     * Returns a property from a engine module.
     *
     * @param mod
     * @param name
     * @return
     */
    public Object getProperty( ENGINE_MODULE mod, String name ){
        ScriptableObject scope = getScopeByMod(mod);
        return scope.get(name);
    }

    /**
     * Evaluates an expression and returns its results.
     * 
     * @param expr
     * @return
     */
    public Object evalExpression( String expr ){
    	return engine.evalExpression(expr);
    }
}
