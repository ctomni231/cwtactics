package com.meowShell;

import com.meowShell.compiler.CompilerBlockNode;
import com.meowShell.compiler.CompilerRootNode;
import com.meowShell.parser.IndentMarker;
import com.meowShell.parser.nodes.NodeDictionary;
import com.yasl.tools.StringTools;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.application.ApplicationFlags.*;
import static com.yasl.logging.Logging.*;

/**
 * MeoWShell parser class, service provider to parse files and string lists.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class MeoWShellParser
{
    static MeoWShellParser INSTANCE = new MeoWShellParser();

    public void parseLine( CompilerRootNode root, IndentMarker.IndentMarkerHolder indention , String line )
    {
        assertNotNull(indention);
        assertNotNull(line);

        // get indention and last sign
        int[] indent = indentationOfStatement(line);
        int lastSign = indexOfComment(line);

        if (lastSign == -1)
            lastSign = line.length();

        // it's a comment or empty line
        if (indent[0] == lastSign)
            return;
      
        if( appFlagExist( COMPILER_DEBUG ))
            log("Parsing meow shell statement "+line);

        // reset active node
        while( indention.marker.indention >= indent[0] )
        {
            if( appFlagExist( COMPILER_DEBUG ) )
            {
                log("breaking one block level");
                log("old level was "+indention.marker.indention);
                log("current level is "+indent[0]);
            }

            // we can't go further than the root level indention
            assertNotNull( indention.marker.preDecessor );

            indention.marker.node.addJavaSourceCode("}");
            indention.marker = indention.marker.preDecessor;
        }

        line = line.substring(indent[0], lastSign);
        if( line.contains(":") )
        {
            // block statement
            
            if( NodeDictionary.getInstance().isFunction(line) )
                indention.marker = new IndentMarker( indention.marker , new CompilerBlockNode() , indent[0] );
            else
                indention.marker = new IndentMarker( indention.marker , indention.marker.node , indent[0] );

            NodeDictionary.getInstance().parseActorStatement(indention, line);
        }
        else
        {
            if( line.contains(";") )
            {
                String[] subLines = StringTools.splitAtChar(line, ';', '"');
                
                int e = subLines.length;
                for( int i = 0 ; i < e ; i++ )
                {
                    NodeDictionary.getInstance().parseActorStatement(indention, subLines[i] );
                    indention.marker.node.addJavaSourceCode(";");
                }
            }
            else
            {
                NodeDictionary.getInstance().parseActorStatement(indention, line);
                indention.marker.node.addJavaSourceCode(";");
            }
        }
    }

    /**
     * Checks the index of a comment in a statement.
     *
     * @param str statement string
     * @return the index of the comment character or -1 if no comment is in
     *         the statement
     */
    public static int indexOfComment(String str)
    {
        int i;
        int e = str.length();
        boolean inString = false;
        char ch;

        for (i = 0; i < e; i++) {
            ch = str.charAt(i);

            if (!inString) {
                if (ch == '#') {
                    return i;
                } else if (ch == '"') {
                    inString = true;
                }
            } else if (ch == '"') {
                inString = false;
            }

        }

        return -1;
    }

    /**
     * Checks the distance from the left border and remembers the index
     * of the first char of a statement.
     *
     * @param str statement string
     * @return integer array with this
     *         shape [ index of first char , distance from left border ]
     */
    public static int[] indentationOfStatement(String str)
    {
        char ch;
        int i;
        int l = 0;
        int e = str.length();
        boolean stop = false;

        for (i = 0; !stop && i < e; i++) {
            ch = str.charAt(i);
            switch (ch) {
                case ' ':
                    l++;
                    break;

                case '\t':
                    l += 4;
                    break;

                default:
                    stop = true;
            }
        }
        if( i == 0 )
            i = 1;

        return new int[]{i - 1, l};
    }

    public static MeoWShellParser getInstance()
    {
        return INSTANCE;
    }
}
