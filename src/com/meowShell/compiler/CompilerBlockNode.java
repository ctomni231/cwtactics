package com.meowShell.compiler;

import java.util.HashSet;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Block node class, that represents a function or root level block of a
 * meow shell script.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class CompilerBlockNode
{
    private StringBuilder context;
    private HashSet<String> variables;

    public CompilerBlockNode()
    {
        context = new StringBuilder();
        variables = new HashSet<String>();
    }

    /**
     * Adds java source code context to the meow shell block node.
     *
     * @param code java source code as string
     */
    public void addJavaSourceCode( String code )
    {
        assertNotNull(code);

        context.append(code);
    }

    /**
     * Adds java source code context to the meow shell block node.
     *
     * @param code java source code as string
     */
    public void addJavaSourceCode( float code )
    {
        context.append(code);
    }

    public String getJavaSourceCode()
    {
        StringBuilder b = new StringBuilder();

        b.append( context.toString() );

        Object[] a = variables.toArray();
        int e = a.length;
        for( int i = 0 ; i < e ; i++ )
        {
            b.insert(1, ";" );
            b.insert(1, a[i] );
            b.insert(1, "com.meowShell.variables.MeoWObject " );
        }

        b.insert( b.length()-1, "return com.meowShell.variables.MeoWNone.NONE;");

        return b.toString();
    }

    /**
     * Adds a local variable to the block node.
     *
     * @param name
     */
    public void addVariable( String name )
    {
        assertNotNull(name);

        if( !variables.contains(name) )
            variables.add(name);
    }

    @Override
    public String toString()
    {
        StringBuilder b = new StringBuilder("Block Node\n");
        
        b.append("  Variables:\n");
        Object[] vars = variables.toArray();
        int e = vars.length;
        for( int i = 0 ; i < e ; i++ )
        {
            b.append("   - ");
            b.append( vars[i].toString() );
            b.append("\n");
        }

        b.append("  Content:\n   ");
        b.append(context.toString());

        return b.toString();
    }
}
