package com.engine;

import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.ScriptableObject;

import static com.engine.EngineUtil.*;

/**
 * This class is to just make the connection from JavaScript to the
 * Java engine with a very loose connection. This class has very
 * limited functionality and is just used to bridge the connections. 
 *
 * @author Carr, Crecen
 * @author BlackCat
 * @license Look into "LICENSE" file for further information
 */
public class EngineObject {

  private ScriptableObject object;

  public EngineObject( ScriptableObject object ){
    if( object == null ) throw new NullPointerException();
    
    this.object = object;
  }

  /**
	 * This function calls a function through the JavaScript engine and returns
	 * the response
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Integer
	 */
  public Object callFunction( String fn, Object... args ){
    return ScriptableObject.callMethod( object, fn, args);
  }

	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value
	 * @param name The name of the property key
	 * @return The value pertaining to the property key
	 */
  public Object getProperty( String name ){
    return object.get(name);
  }
  
  /**
   * 
   * @param index
   * @return 
   */
  public Object getIndex( int index ){
    return object.get(index, object);
  }
  
  /**
   * 
   * @param name 
   */
  public void deleteProperty( String name ){
    object.delete(name);
  }
  
  /**
	 * This function calls a function through the JavaScript class and returns
	 * the response within String format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a String
	 */
	public String callFunctionAsString(String function, Object... args){
		return (String)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a String
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a String
	 */
	public String getPropertyAsString(String name){
		return getProperty(name).toString();
	}
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within Double format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Double
	 */
	public double callFunctionAsDouble(String function, Object... args){
		return (Double)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a Double
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a Double
	 */
	public double getPropertyAsDouble(String name){
		return (Double)getProperty(name);
	}
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within Integer format
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of a Integer
	 */
	public int callFunctionAsInteger(String function, Object... args){
		return (Integer)callFunction(function, args);
	}
  
  public boolean callFunctionAsBoolean(String function, Object... args){
		return (Boolean)callFunction(function, args);
	}
	
	/**
	 * This function gets a property value from the JavaScript engine and returns
	 * the value as a Integer
	 * @param name The name of the property key
	 * @return The value pertaining to the property key as a Integer
	 */
	public int getPropertyAsInteger(String name){
		return (Integer)getProperty(name);
	}
  
  public boolean getPropertyAsBoolean(String name){
		return (Boolean)getProperty(name);
	}
	
	/**
	 * This function calls a function through the JavaScript class and returns
	 * the response within an Object array
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return A response from the engine in form of an Object array
	 */
	public Object[] callFunctionAsArray(String function, Object... args){
		NativeArray array = (NativeArray)callFunction(function, args);
		return array.toArray();
	}
	
	/**
	 * This function gets a property value from the JavaScript Engine and returns
	 * an array from that value
	 * @param name The name of the key property
	 * @return The array pertaining to the property key
	 */
	public Object[] getPropertyAsArray(String name){
		NativeArray array = (NativeArray)getProperty(name);
		return array.toArray();
	} 
  		
	/**
	 * This function checks to see if an function called through the JavaScript Engine
	 * exists.
	 * @param function The function to call in the current module
	 * @param args The arguments for that particular function
	 * @return Whether this function call answer exists (T) or not (F)
	 */
	public boolean callFunctionExists(String function, Object... args){
		return isTrue(callFunction(function, args));
	}
  
}
