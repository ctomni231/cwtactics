package com.meowShell.parser.nodes;

import com.meowShell.parser.statements.Statement;
import java.util.Properties;

/**
 * Class description.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class OperationNumber extends Number implements Node
{
    @Override
    public void parse(Properties properties, StringBuilder context, Statement statement)
    {
        context.append( Float.parseFloat( statement.getStatement() ));
        context.append("f");
    }
}
