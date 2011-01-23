package com.meowShell.parser.nodes;

import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import com.yasl.tools.StringTools;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Variable statement that represents a value in the memory.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Variable extends Node
{

    @Override
    public boolean fits(String statement)
    {
        assertNotNull(statement);

        char first = statement.charAt(0);

        // variable cannot start with a number
        if( first >= 0 && first <= 9 )
            return false;

        // no method call on a variable
        return !statement.contains(".");
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull(nodeTree,statement);

        statement = StringTools.cutOuterCharacters( statement , ' ' );

        if( statement.contains(" ") )
            throwing( new SyntaxException(statement+" as variable name is illegal"));

        nodeTree.marker.node.addJavaSourceCode(statement);
    }

}
