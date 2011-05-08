/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meowEngine;

import com.meowEngine.language.java.MeowConsole;
import com.meowEngine.language.java.MeowSystem;
import org.mozilla.javascript.ScriptableObject;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 08.05.2011
 */
public enum EngineModules
{
	/**
	 * Core module of the meowEngine, will loaded automatically.
	 */
	CORE
	{
		@Override
		public void load(Engine engine)
		{
			loadClazz( engine, MeowConsole.class );
			loadClazz( engine, MeowSystem.class );

			engine.getCompiler().compileFile( 
				Engine.SCRIPT_API_PACKAGE+"Core.js"
			).call( engine.context , engine.rootScope, engine.rootScope, null);
		}
	},

	SOUND
	{

		@Override
		public void load(Engine engine)
		{
			engine.getCompiler().compileFile(
				Engine.SCRIPT_API_PACKAGE+"Sound.js"
			).call( engine.context , engine.rootScope, engine.rootScope, null);
		}
	},

	/**
	 * This modules adds the state controller into the javaScript environment.
	 */
	STATE
	{

		@Override
		public void load(Engine engine)
		{
			engine.getCompiler().compileFile(
				Engine.SCRIPT_API_PACKAGE+"StateCtr.js"
			).call( engine.context , engine.rootScope, engine.rootScope, null);
		}
	},

	/**
	 * Trigger module adds meowEngine's trigger controller into the javaScript
	 * environment, that allows numerous event/handler actions.
	 */
	TRIGGER
	{

		@Override
		public void load(Engine engine)
		{
			engine.getCompiler().compileFile(
				Engine.SCRIPT_API_PACKAGE+"TriggerCtr.js"
			).call( engine.context , engine.rootScope, engine.rootScope, null);
		}
	},

	VIEW
	{

		@Override
		public void load(Engine engine)
		{
			throw new UnsupportedOperationException("Not supported yet.");
		}
	},

	NETWORK
	{

		@Override
		public void load(Engine engine)
		{
			throw new UnsupportedOperationException("Not supported yet.");
		}
	},

	PERSISTENCE
	{

		@Override
		public void load(Engine engine)
		{
			throw new UnsupportedOperationException("Not supported yet.");
		}
	},

	/**
	 * Assert package loads a set of functions into the javaScript environment
	 * to allow easier debug with pre set assertion functions.
	 */
	ASSERT
	{

		@Override
		public void load(Engine engine)
		{
			engine.getCompiler().compileFile(
				Engine.SCRIPT_API_PACKAGE+"Assert.js"
			).call( engine.context , engine.rootScope, engine.rootScope, null);
		}
	};

	public abstract void load( Engine engine );

	private static void loadClazz( Engine engine,
								  Class<? extends ScriptableObject> clazz)
	{
		try{ ScriptableObject.defineClass( engine.rootScope , clazz, true); }
		catch (Exception ex){
			throw new RuntimeException("cant connect class, because of: "+
															ex.getMessage() ); }
	}
}
