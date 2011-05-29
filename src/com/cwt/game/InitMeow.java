package com.cwt.game;

import com.meowRhinoEnv.Engine;
import com.meowRhinoEnv.jsBridges.MeowCompiler;
import com.meowRhinoEnv.jsBridges.MeowConsole;
import com.meowRhinoEnv.jsBridges.MeowTimer;
import java.io.File;

/**
 * Initialization class for the meow engine. It loads and configurates the
 * rhino stack for the meow engine and runs the Init.js file of cwt.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.05.2011
 */
public class InitMeow
{
	public static void main( String[] args )
	{
		// set needed system properties for the rhino stack
		System.setProperty( Engine.MEOW_PATH , "/com/meowEngine/");
		System.setProperty( MeowCompiler.MEOW_SCRIPT_PATH , "/com/cwt/game/");

		Engine environment = new Engine();

		// place js bridges
		environment.injectObjectIn( MeowConsole.class , "meow.out");
		environment.injectObjectIn( MeowTimer.class , "meow.timer");
		environment.injectObjectIn( MeowCompiler.class , "meow.sys.compContext",
												new Object[]{ environment });

		environment.evaluateGlobal("meow.sys.reqModule('Init')");
	}
}
