package com.meowShell.parser.statements;

import java.util.LinkedList;
import static com.yasl.assertions.Assertions.*;

/**
 * An extended statement object, that represents a block statement, that holds
 * more sub statements.
 *
 * @author Radom, Alexander [ blackcat.myako@gmail.com ]
 * @license Look into "LICENSE" file for further information
 * @version 16.01.2011
 */
public class StatementBlock extends Statement
{
    private LinkedList<Statement> subStatements;

    public StatementBlock( String statement , int indent )
    {
        super(statement, indent);
        
        subStatements = new LinkedList<Statement>();
    }

    /**
     * Pushes a statement at the head of the sub statements list.
     *
     * @param statement statement object
     */
    public void pushAtHead( Statement statement )
    {
        assertNotNull(statement);

        subStatements.add( 0 , statement );
    }

    /**
     * Pushes a statement at the tail of the sub statements list.
     *
     * @param statement statement object
     */
    public void pushAtTail( Statement statement )
    {
        assertNotNull(statement);

        subStatements.add( statement );
    }

    /**
     * @return the list of sub statements of this block statement
     */
    public LinkedList<Statement> getSubStatements()
    {
        return subStatements;
    }

}
