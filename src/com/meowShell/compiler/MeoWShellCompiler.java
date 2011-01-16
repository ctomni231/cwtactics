package com.meowShell.compiler;

import com.meowShell.parser.statements.Statement;
import com.meowShell.context.CallAbleBlock;
import com.meowShell.parser.statements.ContextBlock;
import com.meowShell.parser.nodes.NodeDictionary;
import com.meowShell.parser.statements.StatementBlock;
import com.meowShell.parser.nodes.BlockCompiler;
import java.util.Properties;
import static com.yasl.assertions.Assertions.*;

/**
 * MeoWShell compiler service class, compiles parsed code blocks to simple
 * call able block instances.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class MeoWShellCompiler
{
    // singleton instance
    private static final MeoWShellCompiler INSTANCE = new MeoWShellCompiler();

    public static final String TRACE = "compilerTrace";
    
    public static final String ON = "on";
    public static final String OFF = "off";

    /**
     * Compiles a code block to java source code and gives a call able instance
     * of it back.
     *
     * @param properties Properties instance for the compiler
     * @param block code block for the compile process
     * @return call able instance of the code block
     */
    public CallAbleBlock compileBlock( Properties properties , ContextBlock block )
    {
        boolean trace = properties.containsKey(TRACE);

        if( trace )
            System.out.println("MeoWCompiler :: start code block compiling procedure");
        
        int i;
        int e = block.getSubStatements().size();
        StringBuilder b = new StringBuilder();
        NodeDictionary dict = NodeDictionary.getInstance();
        Statement subSt;

        // open bock brace
        b.append("{");
        
        for( i = 0 ; i < e ; i++ )
        {
            subSt = block.getSubStatements().get(i);

            if( trace )
                System.out.println( new StringBuilder("MeoWCompiler :: pre compile statement\n  ")
                                            .append( subSt.getStatement() )
                                            .toString() );

            dict.parseActorStatement( properties, b, subSt );

            // blocks binds it actor statements in a {} block and don't
            // need a ';'
            if( !(subSt instanceof StatementBlock) )
                b.append(";");
        }

        // closing return to fit scripts/functions without
        // a return statement
        b.append("return com.meowShell.variables.MeoWNone.NONE;}");

        if( trace )
            System.out.println( new StringBuilder("MeoWCompiler :: result java code\n  ")
                                        .append(b.toString())
                                        .append("\n")
                                        .append("MeoWCompiler :: compiling java code")
                                        .toString() );

        return BlockCompiler.getInstance().compileFunction("test", b.toString());
    }

    /**
     * Sets the debug parameter to the compiler properties instance.
     *
     * @param properties properties object
     */
    public static void setTraceOn( Properties properties )
    {
        assertNotNull( properties );

        properties.setProperty( TRACE , ON );
    }

    /**
     * Sets the debug parameter to the compiler properties instance.
     *
     * @param properties properties object
     */
    public static void setTraceOff( Properties properties )
    {
        assertNotNull( properties );

        properties.remove( TRACE );
    }


    /**
     * Returns the singleton instance of the singleton class.
     * @return meow shell compiler instance
     */
    public static MeoWShellCompiler getInstance()
    {
        return MeoWShellCompiler.INSTANCE;
    }

 }
