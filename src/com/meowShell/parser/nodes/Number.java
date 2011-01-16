package com.meowShell.parser.nodes;

import java.util.Properties;
import com.meowShell.parser.statements.Statement;
import static com.yasl.assertions.Assertions.*;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 15.01.2011
 */
public class Number implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );

        try
        {
            Float.parseFloat(statement.getStatement());
            return true;
        }
        catch( NumberFormatException e )
        {
            return false;
        }
    }

    public void parse( Properties properties , StringBuilder context , Statement statement )
    {
        assertNotNull( statement );

        context.append( "new com.meowShell.variables.MeoWNumber(" );
        context.append( statement.getStatement() );
        context.append( "f)" );
    }

}
