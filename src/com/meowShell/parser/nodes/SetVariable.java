package com.meowShell.parser.nodes;

import com.meowShell.exception.SyntaxException;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class SetVariable implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        int index = statement.getStatement().indexOf('=');

        // no '=' in the statement, not set var
        if( index == -1 )
            return false;

        // is the '=' a '==' in a compare ?
        return ( statement.getStatement().charAt(index+1) != '=' &&
                 statement.getStatement().charAt(index-1) != '!' );
    }

    public void parse( Properties properties , StringBuilder context , Statement statement )
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        String statementS = statement.getStatement();

        int pos = -1;
        int ind = statementS.indexOf('=');
        assert ind != -1;

        String varName = statementS.substring(0, ind );

        char first = varName.charAt(0);
        if( first >= 0 && first <= 9 )
            throw new SyntaxException("variable cannot begin with a number");

        String execution = statementS.substring( ind+1,statementS.length());
        
        context.append("com.meowShell.variables.MeoWObject ");
        context.append(varName);
        context.append(" = ");

        // right side
        NodeDictionary.getInstance().parseReturnerStatement(properties, context, new Statement( execution, -1));
    }

}
