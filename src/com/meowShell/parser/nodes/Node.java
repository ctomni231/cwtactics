package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker;

/**
 * A MeowShell syntax node.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public abstract class Node
{
    abstract public boolean fits( String statement );
    abstract public void parse( IndentMarker.IndentMarkerHolder nodeTree ,
                                                        String statement );
}
