package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Simple ++ operator, used on numeric data types.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Increament extends Node
{

    @Override
    public boolean fits(String statement)
    {
        assertNotNull( statement );
        assertGreater( statement.length() , 0);

        return statement.endsWith("++");
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull( statement , nodeTree );
        assertGreater( statement.length() , 0);

        String varName = statement.substring(0, statement.length()-2);

        NodeDictionary.getInstance().parseVarReturnerStatement( nodeTree , varName );

        nodeTree.marker.node.addJavaSourceCode(".plus(1f)");
    }

}
