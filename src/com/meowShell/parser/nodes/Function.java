package com.meowShell.parser.nodes;

import com.meowShell.parser.IndentMarker;
import java.util.Properties;
import com.meowShell.parser.statements.Statement;

import static com.yasl.assertions.Assertions.*;
import static com.yasl.logging.Logging.*;
import static com.yasl.application.ApplicationFlags.*;

/**
 * Function statement.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 22.01.2011
 */
public class Function extends ContainerNode
{

    public Function()
    {
        super("def");
    }

    @Override
    public boolean fits( String statement)
    {   
        return super.fits( statement );
    }

    @Override
    public void parse( IndentMarker.IndentMarkerHolder nodeTree , String statement )
    {
        super.parse( nodeTree, statement );
        
        notImplemetedYet();
    }

}
