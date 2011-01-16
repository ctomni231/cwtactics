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
public class TempPrint implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        int index = statement.getStatement().indexOf('=');

        return ( statement.getStatement().startsWith("print(") &&
                 statement.getStatement().endsWith(")") );
    }

    public void parse( Properties properties , StringBuilder context , Statement statement )
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        String parameter = statement.getStatement().substring( statement.getStatement().indexOf("(")+1, statement.getStatement().length()-1 );

        context.append("System.out.println( ");
        context.append( parameter );
        context.append(".toString() )");
    }

}
