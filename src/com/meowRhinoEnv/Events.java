package com.meowRhinoEnv;

import com.yasl.annotation.ParentModulePointer;
import com.yasl.annotation.SubModule;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Sub module of the class @link{com.meowEngineRhinoStack.Engine}, that can be
 * used to fire events in the engine context.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 29.05.2011
 */
@SubModule("com.meowEngineRhinoStack.Engine")
public class Events
{
	@ParentModulePointer private Engine engine;

	public Events( Engine engine )
	{
		notNull(engine);

		this.engine = engine;

		init();
	}

	private void init()
	{
		engine.evaluateGlobal(
				  "if( typeof keyDown !== 'function') keyDown = function(){};"
				+ "if( typeof keyUp !== 'function') keyUp = function(){};");
	}

	public void keyDown( int keyCode )
	{
		engine.evaluateGlobal("keyDown("+keyCode+")");
	}

	public void keyUp( int keyCode )
	{
		engine.evaluateGlobal("keyUp("+keyCode+")");
	}

	public void invokeEvent( String eventName, Object... parameters )
	{
		StringBuilder code = new StringBuilder(eventName);

		code.append("(");
		for( int i = 0; i < parameters.length ; i++ )
		{
			if( i > 0 && i < parameters.length-1 ) code.append(",");
			code.append( parameters[i] );
		}
		code.append(");");

		engine.evaluateGlobal( code.toString() );
	}
}
