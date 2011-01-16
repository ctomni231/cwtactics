package com.meowShell.parser.nodes;

import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 13.01.2011
 */
public class ArithmeticOperatior implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        String str = statement.getStatement();
        return (
            str.contains("+=") ||
            str.contains("-=") ||
            str.contains("*=") ||
            str.contains("/=") ||
            str.contains("%=") ||
            str.contains("^=") ||
            str.contains("<=")
        );
    }

    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        assertNotNull( statement , context , properties );
        assertGreater( statement.getStatement().length() , 0);

        String str = statement.getStatement();
        int index = str.indexOf("=");

        assertGreater(index, 1);

        String varName = str.substring(0,index-1);
        String rigthStatement = str.substring(index+1,str.length());

        context.append(varName);
        switch( str.charAt(index-1) )
        {
            case '<':
                context.append(".setNumericValue(");
                break;
            case '+':
                context.append(".plus(");
                break;
            case '-':
                context.append(".minus(");
                break;
            case '*':
                context.append(".multiply(");
                break;
            case '/':
                context.append(".divide(");
                break;
            case '%':
                context.append(".mod(");
                break;
            case '^':
                context.append(".pow(");
                break;
            default:
                throw new UnknownError();
        }

        //TODO
        NodeDictionary.getInstance().parseOperationPartStatement(properties, context, new Statement(rigthStatement,-1));

        context.append(")");
    }

}
