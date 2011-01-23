package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import static com.yasl.assertions.Assertions.*;

/**
 * Numerical expression.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Number extends Node
{
    @Override
    public boolean fits(String statement)
    {
        assertNotNull( statement );

        try
            { Float.parseFloat(statement); return true; }
        catch( NumberFormatException e )
            { return false; }
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull( statement );

        nodeTree.marker.node.addJavaSourceCode( "new com.meowShell.variables.MeoWNumber(" );
        nodeTree.marker.node.addJavaSourceCode( statement );
        nodeTree.marker.node.addJavaSourceCode( "f)" );
    }

}
