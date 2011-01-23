package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker;
import static com.yasl.assertions.Assertions.*;
import com.meowShell.parser.statements.Statement;
import java.util.Properties;

/**
 * Represents a variable in a operation statement.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class OperationVariable extends Node
{

    @Override
    public boolean fits( String statement)
    {
        assertNotNull(statement);

        return !statement.contains(".");
    }

    @Override
    public void parse( IndentMarker.IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull( nodeTree , statement );

        nodeTree.marker.node.addJavaSourceCode( statement );
        nodeTree.marker.node.addJavaSourceCode(".getNumericValue()");
    }

}
