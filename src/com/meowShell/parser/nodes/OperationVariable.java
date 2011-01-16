package com.meowShell.parser.nodes;

import static com.yasl.assertions.Assertions.*;
import com.meowShell.parser.statements.Statement;
import java.util.Properties;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 15.01.2011
 */
public class OperationVariable implements Node
{

    public boolean fits(Statement statement)
    {
        assertNotNull(statement);

        return !statement.getStatement().contains(".");
    }

    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        assertNotNull(context,statement,properties);

        context.append( statement.getStatement() );
        context.append(".getNumericValue()");
    }

}
