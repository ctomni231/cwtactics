package com.meowRhinoEnv.jsBridges;

import com.meowRhinoEnv.Engine;
import java.io.File;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 05.05.2011
 */
public class MeowCompiler extends JsBridge
{
	public static String MEOW_SCRIPT_PATH = "meowScriptPath";

	private Engine engine;

	@Override
	public void setParameters(Object... args)
	{
		engine = (Engine) args[0];
	}

	public void jsFunction_loadJS( String fpath )
	{
		String path;
		File file;

		path = System.getProperty( "user.dir" ) +
			   System.getProperty( MEOW_SCRIPT_PATH ) +
			   fpath;
		file = new File(path);
		if( !file.exists() )
		{
			path = System.getProperty( "user.dir" ) +
				   System.getProperty( Engine.MEOW_PATH ) +
				   fpath;
			file = new File(path);
		}

		engine.evaluateFileGlobal(file);
	}

}
