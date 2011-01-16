package com.meowShell.parser.nodes;

import com.meowShell.parser.statements.Statement;
import java.util.Properties;

/**
 * A MeowShell syntax node.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 06.01.2011
 */
public interface Node
{
    boolean fits( Statement statement );
    void parse( Properties properties , StringBuilder context , Statement statement );
}
