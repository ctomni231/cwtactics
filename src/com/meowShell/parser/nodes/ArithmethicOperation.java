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
public class ArithmethicOperation implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        return 
        (
         statement.getStatement().contains("+") ||
         statement.getStatement().contains("-") ||
         statement.getStatement().contains("/") ||
         statement.getStatement().contains("*") ||
         statement.getStatement().contains("%") ||
         statement.getStatement().contains("^")
        );
    }

    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        assertNotNull( statement , context , properties );
        assertGreater( statement.getStatement().length() , 0);

        
    }

}
