package com.cwt.game;

import com.meowRhinoEnv.Engine;
import com.meowRhinoEnv.jsBridges.MeowCompiler;
import com.meowRhinoEnv.jsBridges.MeowConsole;
import com.meowRhinoEnv.jsBridges.MeowDataBase;
import com.meowRhinoEnv.jsBridges.MeowTimer;
import java.io.File;

/**
 * Initialization class for the meow engine. It loads and configurates the
 * rhino stack for the meow engine and runs the Init.js file of cwt.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into$ "LICENSE" file for further information
 * @version 29.05.2011
 */
public class InitMeow
{
	public static void main( String[] args )
	{
		// set needed system properties for the rhino stack
		System.setProperty( Engine.MEOW_PATH , "/src/com/meowEngine/");
		System.setProperty( Engine.MEOW_SCRIPT_PATH , "/src/com/cwt/core_mods/");

		Engine environment = new Engine();

		// place js bridges
		environment.injectObjectIn( MeowConsole.class , "console");
		environment.injectObjectIn( MeowTimer.class , "timer");

		environment.evaluateScriptFile("/library/Core.js");
        environment.evaluateScriptFile("/library/Testing.js");

        environment.evaluateScriptFile("/library/StateMachine.js");


        //environment.evaluateGlobal("meowEngine.parseJSON = JSON.parse;"+
        //                           "meowEngine.toJSON = JSON.stringify;");

        environment.evaluateGlobal("meowEngine.registerShortCuts();");

        // Start Testing
        environment.evaluateScriptFile("/test/MeowEngine_Test.js");

        //environment.evaluateGlobal("meowEngine.test.placeTracer( testOBJ, true);");
        environment.evaluateGlobal("meowEngine.test.runAll();");

       	//environment.evaluateScriptFile("Init.js");
	}
}
