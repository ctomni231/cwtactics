package com.meowEngine;

import com.meowEngine.language.java.MeowConsole;
import com.meowEngine.language.java.MeowInput;
import com.meowEngine.language.java.MeowNetwork;
import com.meowEngine.language.java.MeowSystem;
import com.yasl.annotation.CompositeModule;
import com.yasl.annotation.SubModulePointer;
import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import org.mozilla.javascript.*;

import static com.yasl.assertions.Assertions.*;

/**
 * This class holds all necessary data for the MeowEngine context.
 */
@CompositeModule
public class Engine
{
	public static final String SCRIPT_API_PACKAGE = "/com/meowEngine/language/script/";
	public static final double VERSION = 2.90;

	@SubModulePointer private final Compiler compiler;
	@SubModulePointer private Network networkCtr;
	@SubModulePointer private Persistence persistCtr;

	private HashSet<EngineModules> activeMods;

	final Context context;
	final ScriptableObject rootScope;

	public Engine( boolean debug )
	{
		context = Context.enter();
		rootScope = context.initStandardObjects();

		compiler = new Compiler(this);
		networkCtr = null;
		persistCtr = null;

		compiler.debug = debug;

		activeMods = new HashSet<EngineModules>();

		initializeRootStruct();
		initializeNativeCallSecurity();
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

	public void insertIntoScope(Class<? extends ScriptableObject> clazz)
	{
		try
		{
			ScriptableObject.defineClass(rootScope, clazz, true);
		}
		catch (Exception ex)
		{
			throw new RuntimeException("cant connect class");
		}
	}

	private void initializeRootStruct()
	{
		Scriptable root = context.newObject(rootScope);
		rootScope.defineProperty("meow", root, 5);

		rootScope.put("VERSION", root, VERSION);

		pushRequiredModule("core");
	}

	@Override
	protected void finalize() throws Throwable
	{
		context.exit();

		super.finalize();
	}

	/**
	 * @return the compiler
	 */
	public Compiler getCompiler()
	{
		return compiler;
	}

	/**
	 * @return the networkCtr
	 */
	public Network getNetworkCtr()
	{
		return networkCtr;
	}

	/**
	 * @param networkCtr the networkCtr to set
	 */
	void setNetworkCtr(Network networkCtr)
	{
		this.networkCtr = networkCtr;
	}

	/**
	 * @return the persistCtr
	 */
	public Persistence getPersistCtr()
	{
		return persistCtr;
	}

	/**
	 * @param persistCtr the persistCtr to set
	 */
	void setPersistCtr(Persistence persistCtr)
	{
		this.persistCtr = persistCtr;
	}

	public void pushRequiredModule( String mod )
	{
		notNull(mod);

		EngineModules[] names = EngineModules.values();
		EngineModules tmp;
		int e = names.length;
		for( int i = 0 ; i < e ; i++ )
		{
			tmp = names[i];
			if( tmp.name().equalsIgnoreCase(mod) )
			{
				// skip if already loaded
				if( activeMods.contains(tmp) )
					return;

				tmp.load(this);
				activeMods.add(tmp);

				return;
			}
		}

		throw new IllegalArgumentException("unkown module: "+mod);
	}



	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////

	public static void main( String[] args )
	{
		Engine eng = new Engine( true );

		Function f = eng.getCompiler().compileFile( new File("Test.js") );

		f.call( eng.context , eng.rootScope ,  eng.rootScope, null);
	}
}
