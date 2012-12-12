package com.engine;

/*
 * EngineBridge.java
 *
 * This class is to just make the connection from JavaScript to the
 * Java engine with a very loose connection. This class has very
 * limited functionality and is just used to bridge the connections. 
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 12.10.12
 */
public class EngineBridge {
	/** This holds whether all files will be loaded separately (T) or together (F) */
	public final static boolean DEVLOAD = true;	
	/** This is the JavaScript engine holder */
	private static EngineHolder holder = new EngineHolder( new Engine( DEVLOAD ) );
	/** This holds the different modules that will be used for this engine */
	private static EngineHolder.ENGINE_MODULE module = EngineHolder.ENGINE_MODULE.GLOBAL;
	
	/**
	 * This is used to quickly change modules by using a String reference
	 * @param mod The module name to change to
	 * @return Whether module was changed(T) or not(F)
	 */
	public static boolean setModule(String mod){
		if(mod.matches("GL.*"))
			module = EngineHolder.ENGINE_MODULE.GLOBAL;
		else if(mod.matches("GA.*"))
			module = EngineHolder.ENGINE_MODULE.GAME;
		else if(mod.matches("PE.*"))
			module = EngineHolder.ENGINE_MODULE.PERSISTENCE;
		else if(mod.matches("CO.*"))
			module = EngineHolder.ENGINE_MODULE.CONTROLLER;
		else if(mod.matches("SI.*"))
			module = EngineHolder.ENGINE_MODULE.SIGNAL;
		else
			return false;
		return true;
	}
	
	/**
	 * This function gets the current module used in this class
	 * @return The current module being used
	 */
	public static String getCurrentModule(){
		switch( module ){
        	case GAME: 
        		return "GAME";
        	case SIGNAL: 
        		return "SIGNAL";
        	case CONTROLLER: 
        		return "CONTROLLER";
        	case PERSISTENCE: 
        		return "PERSISTENCE";
        	case GLOBAL: 
        		return "GLOBAL";
        	default: 
        		return "UNKNOWN";
        }
    }
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within String format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a String
	 */
	public static String callFunctionAsString(String function, Object... args){
		return (String)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a String
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a String
	 */
	public static String getPropertyAsString(String name){
		return (String)getProperty(name);
	}
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within Double format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Double
	 */
	public static double callFunctionAsDouble(String function, Object... args){
		return (Double)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a Double
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a Double
	 */
	public static double getPropertyAsDouble(String name){
		return (Double)getProperty(name);
	}
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within Integer format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Integer
	 */
	public static int callFunctionAsInteger(String function, Object... args){
		return (Integer)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a Integer
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a Integer
	 */
	public static int getPropertyAsInteger(String name){
		return (Integer)getProperty(name);
	}
	
	/**
	 * This function calls a function through the JavaScript engine and returns
	 * the response
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Integer
	 */
	public static Object callFunction(String function, Object... args){
		return holder.callFunction(module, function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value
	 * @param name The name of the property key
	 * @return The value pertaining to the property key
	 */
	public static Object getProperty(String name){
		return holder.getProperty(module, name);
	}
	
	/**
	 * This function is an exact replica of the Engine.java evaluate function. It
	 * takes an expression and evaluates it within the Engine class.
	 * @param expr The String expression to evaluate
	 * @return Data representing the evaluated expression.
	 */
	public static Object evalExpression( String expr ){
		return holder.evalExpression(expr);
	}
}
