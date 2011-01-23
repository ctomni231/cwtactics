package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Copy operator that produces a clone of a meow object data type.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Copy extends Node
{

    @Override
    public boolean fits(String statement)
    {
        assertNotNull( statement );
        assertGreater( statement.length() , 0);

        return statement.startsWith("&");
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull( statement , nodeTree );
        assertGreater( statement.length() , 0);

        String varName = statement.substring(1, statement.length());

        NodeDictionary.getInstance().parseReturnerStatement(nodeTree,varName);
        nodeTree.marker.node.addJavaSourceCode(".clone()");
    }

}
