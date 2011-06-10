package com.meowRhinoEnv.jsBridges;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowTimer extends JsBridge
{
	public static void jsFunction_sleep( int time )
	{
		try
		{
			Thread.sleep(time);
		}
		catch (InterruptedException ex)
		{
			Logger.getLogger(MeowTimer.class.getName()).log(Level.SEVERE, null, ex);
		}
	}
}
