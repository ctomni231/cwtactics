package com.meowShell.parser.nodes;

import com.yasl.tools.StringTools;
import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker;
import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Abstract container block that will be used to simplify the defining of block
 * statements.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public abstract class ContainerNode extends Node
{
    private String keyword;
    protected String contentMiddle;
    protected String contentAfter;

    public ContainerNode( String keyword )
    {
        assertNotNull(keyword);
        assertGreater(keyword.length(), 0);

        this.keyword = keyword;
    }

    @Override
    public boolean fits( String statement )
    {
        if( statement.startsWith(keyword) )
            if( statement.contains(":") )
                return true;
            else
                throwing( new SyntaxException("block keyword without :") );

        return false;
    }

    @Override
    public void parse( IndentMarker.IndentMarkerHolder nodeTree , String statement )
    {
        int iStart = keyword.length();
        int iSep = statement.indexOf(":");

        // get middle and after blocks
        contentMiddle = statement.substring( iStart , iSep );
        contentAfter = statement.substring( iSep+1 , statement.length() );

        // open block brace
        //nodeTree.marker.node.addJavaSourceCode("{");
    }

    protected void parseContentAfter( IndentMarker.IndentMarkerHolder nodeTree )
    {
        String[] subLines = StringTools.splitAtChar(contentAfter, ';', '"');

        int e = subLines.length;
        for( int i = 0 ; i < e ; i++ )
        {
            NodeDictionary.getInstance().parseActorStatement(nodeTree, subLines[i] );
            nodeTree.marker.node.addJavaSourceCode(";");
        }
    }
}
