package com.meowRhinoEnv.jsBridges;

import com.meowRhinoEnv.Engine;
import java.lang.reflect.InvocationTargetException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.ScriptableObject;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.05.2011
 */
public class JsBridge extends ScriptableObject
{

	public static void defClassIn( Class<? extends JsBridge> clazz, ScriptableObject scope )
	{
		try
		{
			ScriptableObject.defineClass(scope, clazz);
		}
		catch ( Exception ex)
		{
			System.err.println( "can't implement class because of: "+ex.getMessage());
		}
	}

	public static void placeInstanceIn( Class<? extends JsBridge> clazz, Engine eng, String path , Object... args )
	{
		try
		{
			if( eng.evaluateGlobal("typeof "+clazz.getSimpleName()+" === 'function'").equals(Boolean.TRUE))
			{
				eng.evaluateGlobal( path+" = new "+clazz.getSimpleName()+"();");

				if( args != null )
				{
					((JsBridge) eng.evaluateGlobal(path)).setParameters(args);
				}
			}
			else throw new UnsupportedOperationException("constructor function not exists, can't place object");
		}
		catch( Exception ex )
		{
			if( ex instanceof UnsupportedOperationException ) throw (UnsupportedOperationException) ex;

			System.err.println( "can't instantiate class because of: "+ex.getMessage());
		}
	}

	public void setParameters( Object... args ){}

	@Override
	public String getClassName()
	{
		return getClass().getSimpleName();
	}

}
