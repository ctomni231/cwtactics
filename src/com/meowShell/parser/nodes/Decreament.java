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
public class Decreament implements Node
{

    public boolean fits( Statement statement)
    {
        assertNotNull( statement );
        assertGreater( statement.getStatement().length() , 0);

        return statement.getStatement().endsWith("++");
    }

    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        assertNotNull( statement , context , properties );
        assertGreater( statement.getStatement().length() , 0);

        String varName = statement.getStatement().substring(0, statement.getStatement().length()-2);

        NodeDictionary.getInstance().parseVarReturnerStatement(properties,
                                                                 context,
                                                                 new Statement(varName, -1));
        
        context.append(".minus(1f)");
    }

}
