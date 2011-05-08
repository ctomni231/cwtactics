package com.meowEngine.language.java;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowSystem extends ScriptableObject
{
	public static void jsStaticFunction_sleep( int time )
	{
		try
		{
			Thread.sleep(time);
		}
		catch (InterruptedException ex)
		{
			Logger.getLogger(MeowSystem.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
	

	@Override
	public String getClassName()
	{
		return "MeowSystem";
	}

}
