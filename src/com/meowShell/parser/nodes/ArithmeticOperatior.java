package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker.IndentMarkerHolder;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class ArithmeticOperatior extends Node
{

    @Override
    public boolean fits(String statement)
    {
        assertNotNull( statement );
        assertGreater( statement.length() , 0);

        return (
            statement.contains("+=") ||
            statement.contains("-=") ||
            statement.contains("*=") ||
            statement.contains("/=") ||
            statement.contains("%=") ||
            statement.contains("^=") ||
            statement.contains("<=")
        );
    }

    @Override
    public void parse(IndentMarkerHolder nodeTree, String statement)
    {
        assertNotNull( statement , nodeTree );
        assertGreater( statement.length() , 0);

        int index = statement.indexOf("=");

        assertGreater(index, 1);

        String varName = statement.substring(0,index-1);
        String rigthStatement = statement.substring(index+1,statement.length());

        NodeDictionary.getInstance().parseReturnerStatement(nodeTree,varName);
        
        String back = null;
        switch( statement.charAt(index-1) )
        {
            case '<': back = ".setNumericValue("; break;
            case '+': back = ".plus("; break;
            case '-': back = ".minus("; break;
            case '*': back = ".multiply("; break;
            case '/': back = ".divide("; break;
            case '%': back = ".mod("; break;
            case '^': back = ".pow("; break;
            default:
                throw new UnknownError("this should not happen");
        }

        assertNotNull(back);

        nodeTree.marker.node.addJavaSourceCode(back);
        NodeDictionary.getInstance().parseOperationPartStatement(nodeTree,rigthStatement);

        nodeTree.marker.node.addJavaSourceCode(")");
    }

}
