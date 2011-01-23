package com.meowShell.parser.nodes;

import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker;
import com.yasl.tools.StringTools;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Set variable action.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class SetVariable extends Node
{
    @Override
    public boolean fits( String statement )
    {
        assertNotNull( statement );
        assertGreater( statement.length() , 0);

        int index = statement.indexOf('=');

        // no '=' in the statement, not set var
        if( index == -1 )
            return false;

        // is the '=' a '==' in a compare ?
        return ( statement.charAt(index+1) != '=' &&
                 statement.charAt(index-1) != '!' );
    }

    @Override
    public void parse( IndentMarker.IndentMarkerHolder nodeTree , String statement )
    {
        assertNotNull( statement );
        assertGreater( statement.length() , 0);

        int ind = statement.indexOf('=');
        assertGreater(ind, -1);

        String varName = statement.substring(0, ind );

        char first = varName.charAt(0);
        if( first >= 0 && first <= 9 )
            throw new SyntaxException("variable cannot begin with a number");

        String execution = statement.substring( ind+1,statement.length());

        // done by block variable set
        //nodeTree.marker.node.addJavaSourceCode("com.meowShell.variables.MeoWObject ");

        varName = StringTools.cutOuterCharacters(varName, ' ');

        if( varName.contains(" ") )
            throwing( new SyntaxException(varName+" is a illegal variable descriptor") );

        nodeTree.marker.node.addVariable(varName);
        nodeTree.marker.node.addJavaSourceCode(varName);
        nodeTree.marker.node.addJavaSourceCode(" = ");

        // right side
        NodeDictionary.getInstance().parseReturnerStatement(nodeTree,execution);
    }
}