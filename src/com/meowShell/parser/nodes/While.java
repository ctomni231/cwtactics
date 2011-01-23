package com.meowShell.parser.nodes;

import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.IndentMarker.IndentMarkerHolder;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public class While extends ContainerNode
{

    public While()
    {
        super("while");
    }

    private int[] getIndexes( String condition )
    {
        int[] ar = new int[2];

        int i;
        int e = condition.length();
        char ch;
        for( i = 0 ; i < e ; i++ )
        {
            ch = condition.charAt(i);
            if( ch == '<' || ch == '>' || ch == '='  || ch == '!' )
            {
                ar[0] = i;

                ch = condition.charAt(i+1);
                if( ch != '>' && ch != '<' )
                {
                    if( ch == '=' )
                        ar[1] = i+2;
                    else
                        ar[1] = i+1;
                }
                else throw new SyntaxException("wrong compare operator");
            }
        }

        return ar;
    }

    @Override
    public boolean fits(String statement)
    {
        assertNotNull(statement);

        return super.fits( statement );
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        super.parse(nodeTree,statement);

        NodeDictionary dict = NodeDictionary.getInstance();

        
        nodeTree.marker.node.addJavaSourceCode("while(");
        
        // condition
        dict.parseCondition( nodeTree , contentMiddle );

        nodeTree.marker.node.addJavaSourceCode("){");

        if( contentAfter.length() > 0 )
            parseContentAfter(nodeTree);
    }

}
