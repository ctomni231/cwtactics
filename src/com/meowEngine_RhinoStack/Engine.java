package com.meowEngine_RhinoStack;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import com.yasl.annotation.CompositeModule;
import com.yasl.annotation.SubModulePointer;
import java.io.File;
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

	private HashSet<EngineModules> activeMods;

	final Context context;
	final ScriptableObject rootScope;

	public Engine( boolean debug )
	{
		context = Context.enter();
		rootScope = context.initStandardObjects();

		compiler = new Compiler(this);
		networkCtr = null;

		compiler.debug = debug;

		activeMods = new HashSet<EngineModules>();

		context.setOptimizationLevel(9);

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

		// defines basic key listeners ( to prevent null pointer exceptions )
		context.evaluateString(rootScope, "keyPressed = function(){};"
										+ "keyUp = function(){};"
										+ "keyDown = function(){}",
										  "keyList", 0, null);

		rootScope.put("VERSION", root, VERSION);

//		pushRequiredModule("core");
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

	public void fireKeyDownEvent( int keyCode )
	{
		context.evaluateString(rootScope, "keyDown("+keyCode+")", "", 0, null);
	}

	public void fireKeyUpEvent( int keyCode )
	{
		context.evaluateString(rootScope, "keyUp("+keyCode+")", "", 0, null);
	}


	///////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////

	public static void main( String[] args ) throws FileNotFoundException, IOException, SQLException
	{
		Engine eng = new Engine( true );

//		eng.pushRequiredModule("input");
	//	eng.context.evaluateString(eng.rootScope, "function getGlobal(){return (function(){return this;}).call(null);}", "", 0, null);
	//	Function f = eng.getCompiler().compileFile( new File("Test.js") );

		//f.call( eng.context , eng.rootScope ,  eng.rootScope, null);

		//f = eng.getCompiler().compileFile( new File("Test_1.js") );
		//f.call( eng.context , eng.rootScope ,  eng.rootScope, null);

		eng.context.evaluateString(eng.rootScope, "var o = { x:10 , y:{ x:10 , y:20 } };var x = o.y;java.lang.System.out.println( typeof o.y );delete o['y']; java.lang.System.out.println( typeof o.y );java.lang.System.out.println( typeof x );", "", 0, null);
		//eng.context.compileFunction(eng.rootScope, "function(){ loop = function(){ for( var i = 0; i < 10000000 ;i++){} } }", "",0, null).call(eng.context, eng.rootScope, eng.rootScope, null);
		/*
		Script s = eng.context.compileString("loop()", "", 0, null);
		long time;
		for( int i = 0 ; i < 15 ; i++ )
        {
            time = System.nanoTime();

			s.exec( eng.context , eng.rootScope);
			//eng.context.evaluateString(eng.rootScope, "loop()", "", 0, null);
            System.out.println( (System.nanoTime()-time)/1000000d +" FUNC ms");
        }*/

	}
}
