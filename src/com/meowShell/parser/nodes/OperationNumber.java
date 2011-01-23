package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class OperationNumber extends Number
{
    @Override
    public void parse( IndentMarker.IndentMarkerHolder nodeTree , String statement)
    {
        nodeTree.marker.node.addJavaSourceCode(Float.parseFloat(statement));
        nodeTree.marker.node.addJavaSourceCode("f");
    }
}
