package com.meowShell;

import com.meowShell.compiler.ClassCompiler;
import com.meowShell.compiler.CompilerBlockNode;
import com.meowShell.compiler.CompilerRootNode;
import com.meowShell.context.Script;
import com.meowShell.parser.IndentMarker;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * MeowShell engine instance, provides many services to read and executes meow
 * script files.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public final class MeowShellEngine
{
    private static float VERSION = 1.91f;
    
    public MeowShellEngine()
    {
        if( appFlagExist( COMPILER_DEBUG ) )
            log("Started meow shell engine instance v."+VERSION );
    }

    /**
     * Returns the version of the meowShell compiler.
     *
     * @return version as float value
     */
    public final float getVersion(){ return VERSION; }

    /**
     * Compiles a meow shell script file to a meow shell script instance.
     * <br><br>
     * NOTE: A compiled script contains a compiled class model and this model
     * can't unloaded at runtime because of java security model.
     *
     * @param file file instance that will be parsed and compiled
     * @return compiled script instance
     */
    public Script compile( File file )
    {
        if( appFlagExist( COMPILER_DEBUG ) )
            log("Compiling meow shell script file "+file.getPath());

        assertNotNull(file);
        assertTrue(file.canRead());

        BufferedReader reader = null;
        CompilerBlockNode mNode = new CompilerBlockNode();
        CompilerRootNode root = new CompilerRootNode();
        MeoWShellParser parser = MeoWShellParser.INSTANCE;
        root.addNode("call", mNode );
        mNode.addJavaSourceCode("{");

        final IndentMarker.IndentMarkerHolder indentMarker = new IndentMarker.IndentMarkerHolder();
        indentMarker.marker = new IndentMarker(null, mNode, -1);
        try
        {

            reader = new BufferedReader(new FileReader(file));

            String line;
            while(true)
            {
                line = reader.readLine();
    
                // end of file reached
                if( line == null ) break;

                // parse statement
                parser.parseLine(root, indentMarker , line);
            }

            // close left open blocks
            while( indentMarker.marker.preDecessor != null )
            {
                indentMarker.marker.node.addJavaSourceCode("}");
                indentMarker.marker = indentMarker.marker.preDecessor;
            }
            // close root level block
            indentMarker.marker.node.addJavaSourceCode("}");
        } 
        catch (FileNotFoundException ex)
        {
            critical("can't find file "+file);
        }
        catch (IOException ex)
        {
            critical("read exception happend due parsing process "+ex);
        }
        finally
        {
            try{ reader.close(); }
            catch (IOException ex){ criticalExit("can't close file "+ex); }
        }

        if( appFlagExist( COMPILER_DEBUG ) )
            log( file.getPath()+" will now compiled to byte code");

        return ClassCompiler.getInstance().compileBlock(root);
    }
    
    public static void main( String[] args )
    {
        setAppFlag( COMPILER_DEBUG );

        log("starting meow shell agile testing procede, parsing test.mssf");

        MeowShellEngine eng = new MeowShellEngine();
        Script s = eng.compile( new File("Test.mssf") );

        long time;
        for( int x = 0 ; x < 15 ; x++ )
        {
            time = System.nanoTime();
            s.call();
            System.out.print( (System.nanoTime()-time)/1000000d );
            System.out.println(" ms");
        }
    }
}
