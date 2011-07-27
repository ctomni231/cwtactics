package com.cwt.game;

import com.cwt.system.jslix.debug.MemoryTest;
import com.meowRhinoEnv.Engine;
import com.meowRhinoEnv.jsBridges.MeowCompiler;
import com.meowRhinoEnv.jsBridges.MeowConsole;
import com.meowRhinoEnv.jsBridges.MeowDataBase;
import com.meowRhinoEnv.jsBridges.MeowTimer;
import java.io.File;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

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

    public static void main(String[] args)
    {
        // set needed system properties for the rhino stack
        System.setProperty(Engine.MEOW_PATH, "/src/com/meowEngine/");
        System.setProperty(Engine.MEOW_SCRIPT_PATH, "/jsLib/");

        Engine environment = new Engine();

        // place js bridges
        environment.injectObjectIn(MeowConsole.class, "console");
        environment.injectObjectIn(MeowTimer.class, "timer");

        // meow modules
        environment.evaluateScriptFile("/library/Core.js");
        environment.evaluateScriptFile("/library/Container.js");
        environment.evaluateScriptFile("/library/Controls.js");
        environment.evaluateScriptFile("/library/Encoding.js");
        environment.evaluateScriptFile("/library/ObjectPool.js");
        environment.evaluateScriptFile("/library/StateMachine.js");
        environment.evaluateScriptFile("/library/Testing.js");

        // register shortcuts
        environment.evaluateGlobal("meowEngine.registerShortCuts(); var x;");

        String s = "var obj = { x:10 };"+
                   "Object.freeze( obj );"+ // thanks to ringo's rhino fork
                                            // js enabled strict mode (ES5)
                   "obj.x = 20;"+
                   "console.log( '('+obj.x +';'+obj.y+')' );";
        
        environment.evaluateGlobal(s);
        
    }

    static class WR {
        int i;
    }
}
