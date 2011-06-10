package com.meowRhinoEnv;

import com.meowRhinoEnv.jsBridges.JsBridge;
import com.meowRhinoEnv.jsBridges.MeowConsole;
import com.yasl.annotation.CompositeModule;
import com.yasl.annotation.SubModulePointer;
import java.io.File;
import java.io.FileReader;
import org.mozilla.javascript.*;

/**
 * This class holds all necessary data for the MeowEngine context.
 */
@CompositeModule
public final class Engine
{
	public static String MEOW_PATH = "meowPath";
	public static String MEOW_SCRIPT_PATH = "meowScriptPath";

	@SubModulePointer private final Events event;

	private final Context context;
	private final ScriptableObject rootScope;

	public Engine()
	{
		context = Context.enter();
		context.setOptimizationLevel(9);
		rootScope = context.initStandardObjects();

		initializeNativeCallSecurity();

		// place window variable
		evaluateGlobal("if( typeof window === 'undefined' )"
						+ "window = (function(){return this;}).call(null);");
		
		// loads core file of Meow ( every time needed )
		String path = System.getProperty("user.dir")
					 +System.getProperty(MEOW_PATH)
					 +"Core.js";

		evaluateFileGlobal( new File( path ));

		event = new Events(this);
	}

	/**
	 * Set ups the security settings of MeowEngine to prevent miss using of
	 * the scripting features, e.g. to make cheating possible.
	 */
	private void initializeNativeCallSecurity()
	{
		/* 
		 * COMMENTED OUT FOR DEBUG PROCESS
		 *

		// initializes the class shutter
		context.setClassShutter( new ClassShutter(){
		public boolean visibleToScripts( String className )
		{
		return className.startsWith( SCRIPT_API_PACKAGE );
		}
		});


		 */
		// TODO implement sandbox feature.. if neccessary
		// http:codeutopia.net/blog/2009/01/02/sandboxing-rhino-in-java/
	}

	/**
	 * Evaluates a string on the global level of the active context.
	 *
	 * @param code source code
	 * @return result
	 */
	public Object evaluateGlobal( String code )
	{
		return context.evaluateString( rootScope , code , "" , 0, null);
	}

	public Object evaluateFileGlobal( File file )
	{
		try
		{
			return context.evaluateReader(rootScope, new FileReader(file), "", 0, null);
		}
		catch ( Exception ex)
		{
			System.err.println("can't compile file due: "+ex.getMessage());
			return null;
		}
	}

	public void evaluateScriptFile( String fpath )
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

		evaluateFileGlobal(file);
	}

	public void injectObjectIn( Class<? extends JsBridge> clazz , String path , Object... args )
	{
		try
		{
			JsBridge.placeInstanceIn(clazz, this, path , args);
		}
		catch( UnsupportedOperationException e )
		{
			// no class present, place it first
			JsBridge.defClassIn(clazz, rootScope);
			JsBridge.placeInstanceIn(clazz, this, path , args );
		}
	}

	@Override
	protected void finalize() throws Throwable
	{
		context.exit();

		super.finalize();
	}
}
