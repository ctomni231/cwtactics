package com.meowShell.parser.nodes;

import static com.yasl.assertions.Assertions.*;
import com.meowShell.exception.SyntaxException;
import com.meowShell.parser.statements.Statement;
import com.meowShell.parser.statements.StatementBlock;
import java.util.LinkedList;
import java.util.Properties;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public class While implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull(statement);

        if( !statement.getStatement().startsWith("while") )
            return false;

        // while statement has definitely a : in the same line
        if( statement.getStatement().indexOf(':') == -1 )
            throw new SyntaxException("while keyword without : in statement \""+statement+"\"");

        return true;
    }

    public void parse( Properties properties , StringBuilder context , Statement statement )
    {
        assertNotNull(statement);
        
        String statementS = statement.getStatement();
        int indS = statementS.indexOf(':');
        NodeDictionary dict = NodeDictionary.getInstance();

        String condition = statementS.substring(5,indS);
        String rightStatements = statementS.substring(indS+1, statementS.length() );

        context.append("while(");

        int[] ind = getIndexes(condition);
        //dict.parseOperationPartStatement(properties, context, new Statement( condition.substring(0, ind[0]), -1));
        //context.append( condition.substring(ind[0], ind[1]) );
        //dict.parseOperationPartStatement(properties, context, new Statement( condition.substring(ind[1], condition.length()), -1));

        dict.parseCondition(properties, context, new Statement(condition, -1));

        context.append("){");

            if( rightStatements.length() > 0 )
            {
                dict.parseActorStatement(properties, context, new Statement( rightStatements, -1));
                context.append(";");
            }

            int i;
            LinkedList<Statement> subStatements = ((StatementBlock) statement).getSubStatements();
            int e = subStatements.size();
            for( i = 0 ; i < e ; i++ )
            {
                
                dict.parseActorStatement(properties, context, subStatements.get(i));
                context.append(";");
            }

        context.append("}");
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

}
