package com.meowEngine;

import com.yasl.annotation.ParentModulePointer;
import com.yasl.annotation.SubModule;
import java.io.BufferedReader;
import static com.yasl.assertions.Assertions.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.mozilla.javascript.Function;

/**
 * Compiler sub module of the engine class.
 */
@SubModule("com.meowEngine.Engine")
public class Compiler
{
	@ParentModulePointer
	private Engine engine;

	public boolean debug;

	public Compiler( Engine engine )
	{
		assertNotNull(engine);

		this.engine = engine;
	}

	public Function compileFile( String path )
	{
		try
		{
			return compileFile(
					new File( Compiler.class
						.getResource(Engine.SCRIPT_API_PACKAGE + "Core.js")
						.toURI()));
		}
		catch (URISyntaxException ex)
		{
			Logger.getLogger(Compiler.class.getName())
					.warning("Compiler cannot compile file "+path+" because of "
							+ ex.getMessage() );

			return null;
		}
	}

	public Function compileFile( File file )
	{
		assertNotNull( file );
		assertTrue( file.isFile() && file.canRead() );


		BufferedReader r = null;
		try
		{
			r = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
		}
		catch (FileNotFoundException ex)
		{
			Logger.getLogger(Compiler.class.getName()).log(Level.SEVERE, null, ex);
		}
		StringBuilder b = new StringBuilder();
		String line;
		int tmp;
		while( true )
		{
			try
			{
				line = r.readLine();
				if (line == null)
				{
					break;
				}
				else
				{
					tmp = checkDebugLine(line);
					if( tmp != -1 )
					{
						if( debug ) b.append( line.substring( tmp , line.length()) ).append("\n");
						continue;
					}

					b.append(line).append("\n");
				}
			}
			catch (IOException ex)
			{
				Logger.getLogger(Compiler.class.getName()).log(Level.SEVERE, null, ex);
			}
		}
		String content = new StringBuilder("function(){ ").append( b.toString() ).append(" }").toString();
		// compile here
		
		// every script in MeowEngine is internally a function
		return engine.context.compileFunction( engine.rootScope , content, file.getName(), 0, null);
	}

	private int checkDebugLine( String line )
	{
		int pt = line.indexOf("$: ");
		if( pt == -1 )
			return -1;

		for( int i = 0 ; i < pt ; i++ )
			if( line.charAt(i) != ' ' && line.charAt(i) != '\t' )
			{
				System.err.println("line contains pre compiler expression that isn't the first expression... maybe an error :"+line);
				return -1;
			}

		return pt+3;
	}
}