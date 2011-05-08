package com.meowEngine.language.java;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowNetwork extends ScriptableObject
{
	
	public static void jsStaticFunction_syncAttr( )
	{
		throw new UnsupportedOperationException();
	}

	public static void jsStaticFunction_syncObject( )
	{
		throw new UnsupportedOperationException();
	}

	public static void jsStaticFunction_invokeNetFunction( String funcName )
	{
		throw new UnsupportedOperationException();
	}
	
	@Override
	public String getClassName()
	{
		return "MeowNetwork";
	}
}
